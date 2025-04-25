from flask import request
from flask_restful import Resource, Api, reqparse
from models import db, Program
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required, get_jwt_identity

class ProgramResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str, required=True, help='Program name is required')
        self.parser.add_argument('description', type=str, required=False)

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
        Create a new health program
        Expected JSON body:
        {
            "name": "Program Name",
            "description": "Program Description"
        }
        """
        try:
            # Get the current user's ID
            current_user_id = get_jwt_identity()
            
            # Parse and validate the request data
            args = self.parser.parse_args()
            
            # Create new program
            program = Program(
                name=args['name'],
                description=args.get('description', ''),
                created_by=current_user_id
            )
            
            db.session.add(program)
            db.session.commit()
            
            return self.success_response(
                program.__dict__,
                "Program created successfully",
                201
            )
        except IntegrityError:
            db.session.rollback()
            return self.error_response("Program with this name already exists", 409)
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

# Initialize API
api = Api()

def init_program_routes(app):
    api.add_resource(ProgramResource, '/api/programs')
    api.init_app(app) 