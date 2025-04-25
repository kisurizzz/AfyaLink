from flask import request, jsonify
from flask_restful import Resource, Api
from models import db, Client, Program, Enrollment
from sqlalchemy.exc import IntegrityError

class EnrollmentResource(Resource):
    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def post(self):
        """
        Enroll a client in one or more programs
        Expected JSON body:
        {
            "client_id": 1,
            "program_ids": [1, 2, 3]
        }
        """
        data = request.get_json()
        
        if not data or 'client_id' not in data or 'program_ids' not in data:
            return self.error_response("client_id and program_ids are required")
        
        try:
            client = Client.query.get(data['client_id'])
            if not client:
                return self.error_response("Client not found", 404)
            
            enrollments = []
            for program_id in data['program_ids']:
                program = Program.query.get(program_id)
                if not program:
                    return self.error_response(f"Program with ID {program_id} not found", 404)
                
                enrollment = Enrollment(client_id=client.id, program_id=program.id)
                enrollments.append(enrollment)
            
            db.session.add_all(enrollments)
            db.session.commit()
            
            return self.success_response(
                [e.__dict__ for e in enrollments],
                "Client enrolled successfully"
            )
        except IntegrityError:
            db.session.rollback()
            return self.error_response("Client is already enrolled in one or more of these programs", 409)
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

# Initialize API
api = Api()

def init_enrollment_routes(app):
    api.add_resource(EnrollmentResource, '/api/enrollments')
    api.init_app(app) 