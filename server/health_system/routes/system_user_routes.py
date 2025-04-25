from flask import request
from flask_restful import Resource, Api, reqparse
from models import db, SystemUser
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta, UTC
from functools import wraps
import os

# Initialize API
api = Api()

# JWT configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # In production, use environment variable
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            current_user_id = get_jwt_identity()
            current_user = SystemUser.query.get(current_user_id)
            if not current_user:
                return {'message': 'Invalid token'}, 401
        except:
            return {'message': 'Invalid token'}, 401
        
        return f(current_user, *args, **kwargs)
    return decorated

class DoctorResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('username', type=str, required=True, help='Username is required')
        self.parser.add_argument('password', type=str, required=True, help='Password is required')
        self.parser.add_argument('email', type=str, required=True, help='Email is required')

    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def post(self):
        """
        Register a new doctor account
        Expected JSON body:
        {
            "username": "doctor1",
            "password": "securepassword",
            "email": "doctor@example.com"
        }
        """
        try:
            args = self.parser.parse_args()
            
            # here, we heck if user already exists
            if SystemUser.query.filter_by(username=args['username']).first():
                return self.error_response("Username already exists")
            
            if SystemUser.query.filter_by(email=args['email']).first():
                return self.error_response("Email already exists")
            
            # generate salt and hash password
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(args['password'].encode('utf-8'), salt)
            
            # create new doci account
            user = SystemUser(
                username=args['username'],
                password=hashed_password.decode('utf-8'),
                email=args['email']
            )
            
            db.session.add(user)
            db.session.commit()
            
            return self.success_response(
                {'username': user.username, 'email': user.email},
                "Account created successfully",
                201
            )
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

class DoctorLoginResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('username', type=str, required=True, help='Username is required')
        self.parser.add_argument('password', type=str, required=True, help='Password is required')

    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def post(self):
        """
        Login as a doctor
        Expected JSON body:
        {
            "username": "doctor1",
            "password": "securepassword"
        }
        """
        try:
            args = self.parser.parse_args()
            
            user = SystemUser.query.filter_by(username=args['username']).first()
            if not user:
                return self.error_response("Invalid username or password", 401)
            
            # Verify password using bcrypt
            if not bcrypt.checkpw(args['password'].encode('utf-8'), user.password.encode('utf-8')):
                return self.error_response("Invalid username or password", 401)
            
            # Update last login
            user.last_login = datetime.now(UTC)
            db.session.commit()
            
            # Generate JWT token
            access_token = create_access_token(identity=str(user.id))
            
            return self.success_response({
                'token': access_token,
                'user': {
                    'username': user.username,
                    'email': user.email
                }
            }, "Login successful")
        except Exception as e:
            return self.error_response(str(e), 500)

def init_system_user_routes(app):
    api.add_resource(DoctorResource, '/api/doctors')
    api.add_resource(DoctorLoginResource, '/api/doctors/login')
    api.init_app(app) 