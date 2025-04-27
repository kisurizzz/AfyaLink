from flask import request
from flask_restful import Resource, Api, reqparse
from models import db, SystemUser
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta, UTC
from functools import wraps
import os
from sqlalchemy.exc import IntegrityError

# Initialize API
api = Api()

# JWT configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # In production, use environment variable
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

class SystemUserResource(Resource):
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
        Create a new system user
        Expected JSON body:
        {
            "username": "username",
            "password": "password",
            "email": "email@example.com"
        }
        """
        try:
            # Parse and validate the request data
            args = self.parser.parse_args()
            
            # Check if username already exists
            if SystemUser.query.filter_by(username=args['username']).first():
                return self.error_response("Username already exists", 409)
            
            # Create new user
            user = SystemUser(
                username=args['username'],
                email=args['email']
            )
            user.set_password(args['password'])
            
            db.session.add(user)
            db.session.commit()
            
            return self.success_response(
                {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                },
                "User created successfully",
                201
            )
        except IntegrityError:
            db.session.rollback()
            return self.error_response("User with this email already exists", 409)
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

class LoginResource(Resource):
    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def post(self):
        """
        Login a system user
        Expected JSON body:
        {
            "username": "username",
            "password": "password"
        }
        """
        try:
            # Get username and password from request
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return self.error_response("Username and password are required", 400)
            
            # Find user by username
            user = SystemUser.query.filter_by(username=username).first()
            
            if not user or not user.check_password(password):
                return self.error_response("Invalid username or password", 401)
            
            # Create access token with string identity
            access_token = create_access_token(
                identity=str(user.id),  # Convert user.id to string
                fresh=True  # This is a fresh login
            )
            
            return self.success_response(
                {
                    'token': access_token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                },
                "Login successful"
            )
        except Exception as e:
            return self.error_response(str(e), 500)

class LogoutResource(Resource):
    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    @jwt_required()
    def post(self):
        """
        Logout a system user
        Requires JWT token in Authorization header
        """
        try:
            # Get the JWT token
            jwt = get_jwt()
            
            # Add the token to a blacklist (you can implement a token blacklist if needed)
            # For now, we'll just return success as the client will handle token removal
            
            return self.success_response(
                None,
                "Logout successful"
            )
        except Exception as e:
            return self.error_response(str(e), 500)

def init_system_user_routes(app):
    api.add_resource(SystemUserResource, '/api/doctors')
    api.add_resource(LoginResource, '/api/doctors/login')
    api.add_resource(LogoutResource, '/api/doctors/logout')
    api.init_app(app) 