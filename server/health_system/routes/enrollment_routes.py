from flask import request
from flask_restful import Resource, Api, reqparse
from models import db, Client, Program, Enrollment
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required, get_jwt_identity

class EnrollmentResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('client_id', type=int, required=True, help='Client ID is required')
        self.parser.add_argument('program_ids', type=int, action='append', required=True, help='Program IDs are required')

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
        Enroll a client in one or more programs
        Expected JSON body:
        {
            "client_id": 1,
            "program_ids": [1, 2, 3]
        }
        """
        try:
            # Get the current user's ID
            current_user_id = int(get_jwt_identity())
            
            # Parse and validate the request data
            args = self.parser.parse_args()
            
            client = Client.query.get(args['client_id'])
            if not client:
                return self.error_response("Client not found", 404)
            
            enrollments = []
            for program_id in args['program_ids']:
                program = Program.query.get(program_id)
                if not program:
                    return self.error_response(f"Program with ID {program_id} not found", 404)
                
                enrollment = Enrollment(
                    client_id=client.id, 
                    program_id=program.id,
                    created_by=current_user_id
                )
                enrollments.append(enrollment)
            
            db.session.add_all(enrollments)
            db.session.commit()
            
            # Convert enrollment objects to dictionaries
            enrollment_dicts = [{
                'id': e.id,
                'client_id': e.client_id,
                'program_id': e.program_id,
                'enrollment_date': e.enrollment_date.isoformat() if e.enrollment_date else None,
                'status': e.status,
                'created_by': e.created_by
            } for e in enrollments]
            
            return self.success_response(
                enrollment_dicts,
                "Client enrolled successfully"
            )
        except IntegrityError:
            db.session.rollback()
            return self.error_response("Client is already enrolled in one or more of these programs", 409)
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

    @jwt_required()
    def delete(self, client_id, program_id):
        """
        Unenroll a client from a program
        URL parameters:
        - client_id: ID of the client to unenroll
        - program_id: ID of the program to unenroll from
        """
        try:
            # Get the current user's ID
            current_user_id = int(get_jwt_identity())
            
            # Find the enrollment
            enrollment = Enrollment.query.filter_by(
                client_id=client_id,
                program_id=program_id
            ).first()
            
            if not enrollment:
                return self.error_response("Enrollment not found", 404)
            
            # Delete the enrollment
            db.session.delete(enrollment)
            db.session.commit()
            
            return self.success_response(
                None,
                "Client successfully unenrolled from program",
                200
            )
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

# Initialize API
api = Api()

def init_enrollment_routes(app):
    api.add_resource(EnrollmentResource, '/api/enrollments', '/api/enrollments/<int:client_id>/<int:program_id>')
    api.init_app(app) 