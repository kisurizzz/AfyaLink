from flask import request, jsonify
from flask_restful import Resource, Api
from models import db, Program
from sqlalchemy.exc import IntegrityError

class ProgramResource(Resource):
    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def post(self):
        """
        Create a new health program
        Expected JSON body:
        {
            "name": "Program Name",
            "description": "Program Description"
        }
        """
        data = request.get_json()
        
        if not data or 'name' not in data:
            return self.error_response("Program name is required")
        
        try:
            program = Program(
                name=data['name'],
                description=data.get('description', '')
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