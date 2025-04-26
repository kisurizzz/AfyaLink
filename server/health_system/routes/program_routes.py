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
        self.parser.add_argument('duration', type=int, required=False, default=30, help='Duration in days')

    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    @jwt_required()
    def get(self):
        """
        Get all health programs
        Returns a list of all programs
        """
        try:
            # Get all programs
            programs = Program.query.all()
            
            # Convert programs to list of dictionaries
            programs_list = [{
                'id': program.id,
                'name': program.name,
                'description': program.description,
                'duration': program.duration,
                'created_by': program.created_by,
                'created_at': program.created_at.isoformat() if program.created_at else None
            } for program in programs]
            
            return self.success_response(
                programs_list,
                "Programs retrieved successfully"
            )
        except Exception as e:
            return self.error_response(str(e), 500)

    @jwt_required()
    def post(self):
        """
        Create a new health program
        Expected JSON body:
        {
            "name": "Program Name",
            "description": "Program Description",
            "duration": 30  # Duration in days (optional, defaults to 30)
        }
        """
        try:
            # Get the current user's ID
            current_user_id = int(get_jwt_identity())
            
            # Parse and validate the request data
            args = self.parser.parse_args()
            
            # Create new program
            program = Program(
                name=args['name'],
                description=args.get('description', ''),
                duration=args.get('duration', 30),
                created_by=current_user_id
            )
            
            db.session.add(program)
            db.session.commit()
            
            # Convert program object to dictionary
            program_dict = {
                'id': program.id,
                'name': program.name,
                'description': program.description,
                'duration': program.duration,
                'created_by': program.created_by,
                'created_at': program.created_at.isoformat() if program.created_at else None
            }
            
            return self.success_response(
                program_dict,
                "Program created successfully",
                201
            )
        except IntegrityError:
            db.session.rollback()
            return self.error_response("Program with this name already exists", 409)
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

    @jwt_required()
    def put(self, program_id):
        """
        Update an existing health program
        URL parameters:
        - program_id: ID of the program to update
        
        Expected JSON body:
        {
            "name": "Updated Program Name",
            "description": "Updated Program Description",
            "duration": 45  # Duration in days (optional)
        }
        """
        try:
            # Get the current user's ID
            current_user_id = int(get_jwt_identity())
            
            # Find the program
            program = Program.query.get(program_id)
            if not program:
                return self.error_response("Program not found", 404)
            
            # Parse and validate the request data
            args = self.parser.parse_args()
            
            # Update program details
            program.name = args['name']
            program.description = args.get('description', program.description)
            program.duration = args.get('duration', program.duration)
            
            db.session.commit()
            
            # Convert program object to dictionary
            program_dict = {
                'id': program.id,
                'name': program.name,
                'description': program.description,
                'duration': program.duration,
                'created_by': program.created_by,
                'created_at': program.created_at.isoformat() if program.created_at else None
            }
            
            return self.success_response(
                program_dict,
                "Program updated successfully"
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
    api.add_resource(ProgramResource, '/api/programs', '/api/programs/<int:program_id>')
    api.init_app(app) 