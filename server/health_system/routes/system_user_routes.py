from flask import request
from flask_restful import Resource, Api, reqparse
from models import db, SystemUser
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps

# Initialize API
api = Api()

# JWT configuration
JWT_SECRET_KEY = 'your-secret-key'  # In production, use environment variable
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return {'message': 'Token is missing'}, 401
        
        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            current_user = SystemUser.query.get(data['user_id'])
            if not current_user:
                return {'message': 'Invalid token'}, 401
        except:
            return {'message': 'Invalid token'}, 401
        
        return f(current_user, *args, **kwargs)
    return decorated

class SystemUserResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('username', type=str, required=True, help='Username is required')
        self.parser.add_argument('password', type=str, required=True, help='Password is required')
        self.parser.add_argument('email', type=str, required=True, help='Email is required')
        self.parser.add_argument('role', type=str, required=True, help='Role is required')

    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def post(self):
        """
        Register a new system user (admin only)
        Expected JSON body:
        {
            "username": "doctor1",
            "password": "securepassword",
            "email": "doctor@example.com",
            "role": "doctor"
        }
        """
        try:
            args = self.parser.parse_args()
            
            # Check if user already exists
            if SystemUser.query.filter_by(username=args['username']).first():
                return self.error_response("Username already exists")
            
            if SystemUser.query.filter_by(email=args['email']).first():
                return self.error_response("Email already exists")
            
            # Create new system user
            user = SystemUser(
                username=args['username'],
                password=generate_password_hash(args['password']),
                email=args['email'],
                role=args['role']
            )
            
            db.session.add(user)
            db.session.commit()
            
            return self.success_response(
                {'username': user.username, 'email': user.email, 'role': user.role},
                "System user registered successfully",
                201
            )
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

class SystemUserLoginResource(Resource):
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
        Login system user
        Expected JSON body:
        {
            "username": "doctor1",
            "password": "securepassword"
        }
        """
        try:
            args = self.parser.parse_args()
            
            user = SystemUser.query.filter_by(username=args['username']).first()
            if not user or not check_password_hash(user.password, args['password']):
                return self.error_response("Invalid username or password", 401)
            
            # Generate JWT token
            token = jwt.encode({
                'user_id': user.id,
                'username': user.username,
                'role': user.role,
                'exp': datetime.utcnow() + JWT_ACCESS_TOKEN_EXPIRES
            }, JWT_SECRET_KEY)
            
            return self.success_response({
                'token': token,
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                }
            }, "Login successful")
        except Exception as e:
            return self.error_response(str(e), 500)

def init_system_user_routes(app):
    api.add_resource(SystemUserResource, '/api/system-users')
    api.add_resource(SystemUserLoginResource, '/api/system-users/login')
    api.init_app(app) 