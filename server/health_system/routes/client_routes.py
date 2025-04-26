from flask import request
from flask_restful import Resource, Api, reqparse
from models import db, Client, Program, Enrollment
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required, get_jwt_identity

class ClientResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('first_name', type=str, required=True, help='First name is required')
        self.parser.add_argument('last_name', type=str, required=True, help='Last name is required')
        self.parser.add_argument('date_of_birth', type=str, required=True, help='Date of birth is required (DD/MM/YYYY)')
        self.parser.add_argument('gender', type=str, required=True, help='Gender is required')
        self.parser.add_argument('contact_number', type=str, required=False)
        self.parser.add_argument('email', type=str, required=False)
        self.parser.add_argument('address', type=str, required=False)

    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    @jwt_required()
    def get(self, client_id=None):
        """
        Get client details
        If client_id is provided, returns details for that specific client
        Otherwise, returns all clients
        """
        try:
            if client_id is not None:
                # Get specific client
                client = Client.query.get(client_id)
                if not client:
                    return self.error_response("Client not found", 404)

                # Get client's enrollments with program details
                enrollments = Enrollment.query.filter_by(client_id=client_id).all()
                programs = [Program.query.get(e.program_id) for e in enrollments]

                # Format client data
                client_data = {
                    'id': client.id,
                    'first_name': client.first_name,
                    'last_name': client.last_name,
                    'date_of_birth': client.date_of_birth.strftime('%d/%m/%Y'),
                    'gender': client.gender,
                    'contact_number': client.contact_number,
                    'email': client.email,
                    'address': client.address,
                    'created_by': client.created_by,
                    'created_at': client.created_at.isoformat() if client.created_at else None,
                    'programs': [{
                        'id': p.id,
                        'name': p.name,
                        'description': p.description,
                        'duration': p.duration,
                        'created_by': p.created_by,
                        'created_at': p.created_at.isoformat() if p.created_at else None
                    } for p in programs]
                }

                return self.success_response(
                    client_data,
                    "Client details retrieved successfully"
                )
            else:
                # Get all clients
                clients = Client.query.all()
                clients_list = [{
                    'id': client.id,
                    'first_name': client.first_name,
                    'last_name': client.last_name,
                    'date_of_birth': client.date_of_birth.strftime('%d/%m/%Y'),
                    'gender': client.gender,
                    'contact_number': client.contact_number,
                    'email': client.email,
                    'address': client.address,
                    'created_by': client.created_by,
                    'created_at': client.created_at.isoformat() if client.created_at else None
                } for client in clients]

                return self.success_response(
                    clients_list,
                    "Clients retrieved successfully"
                )
        except Exception as e:
            return self.error_response(str(e), 500)

    @jwt_required()
    def post(self):
        """
        Register a new client
        Expected JSON body:
        {
            "first_name": "John",
            "last_name": "Doe",
            "date_of_birth": "01/01/1990",
            "gender": "Male",
            "contact_number": "1234567890",
            "email": "john@example.com",
            "address": "123 Main St"
        }
        """
        try:
            # Get the current user's ID
            current_user_id = int(get_jwt_identity())
            
            # Parse and validate the request data
            args = self.parser.parse_args()
            
            # Convert date string to date object
            try:
                date_of_birth = datetime.strptime(args['date_of_birth'], '%d/%m/%Y').date()
            except ValueError:
                return self.error_response("Invalid date format. Use DD/MM/YYYY")
            
            # Create new client
            client = Client(
                first_name=args['first_name'],
                last_name=args['last_name'],
                date_of_birth=date_of_birth,
                gender=args['gender'],
                contact_number=args.get('contact_number'),
                email=args.get('email'),
                address=args.get('address'),
                created_by=current_user_id
            )
            
            db.session.add(client)
            db.session.commit()
            
            # Convert client object to dictionary
            client_dict = {
                'id': client.id,
                'first_name': client.first_name,
                'last_name': client.last_name,
                'date_of_birth': client.date_of_birth.strftime('%d/%m/%Y'),
                'gender': client.gender,
                'contact_number': client.contact_number,
                'email': client.email,
                'address': client.address,
                'created_by': client.created_by,
                'created_at': client.created_at.isoformat() if client.created_at else None
            }
            
            return self.success_response(
                client_dict,
                "Client registered successfully",
                201
            )
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

    @jwt_required()
    def put(self, client_id):
        """
        Update client details
        Expected JSON body:
        {
            "first_name": "John",
            "last_name": "Doe",
            "date_of_birth": "01/01/1990",
            "gender": "Male",
            "contact_number": "1234567890",
            "email": "john.doe@example.com",
            "address": "123 Main St"
        }
        """
        try:
            # Get the current user's ID
            current_user_id = int(get_jwt_identity())
            
            # Find the client
            client = Client.query.get(client_id)
            if not client:
                return self.error_response("Client not found", 404)
            
            # Parse and validate the request data
            args = self.parser.parse_args()
            
            # Convert date string to date object
            try:
                date_of_birth = datetime.strptime(args['date_of_birth'], '%d/%m/%Y').date()
            except ValueError:
                return self.error_response("Invalid date format. Use DD/MM/YYYY")
            
            # Update client details
            client.first_name = args['first_name']
            client.last_name = args['last_name']
            client.date_of_birth = date_of_birth
            client.gender = args['gender']
            client.contact_number = args.get('contact_number')
            client.email = args.get('email')
            client.address = args.get('address')
            
            db.session.commit()
            
            # Format response
            client_dict = {
                'id': client.id,
                'first_name': client.first_name,
                'last_name': client.last_name,
                'date_of_birth': client.date_of_birth.strftime('%d/%m/%Y'),
                'gender': client.gender,
                'contact_number': client.contact_number,
                'email': client.email,
                'address': client.address,
                'created_by': client.created_by,
                'created_at': client.created_at.isoformat() if client.created_at else None
            }
            
            return self.success_response(
                client_dict,
                "Client details updated successfully"
            )
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

    @jwt_required()
    def delete(self, client_id):
        """
        Delete a client
        URL parameters:
        - client_id: ID of the client to delete
        """
        try:
            # Get the current user's ID
            current_user_id = int(get_jwt_identity())
            
            # Find the client
            client = Client.query.get(client_id)
            if not client:
                return self.error_response("Client not found", 404)
            
            # Delete all enrollments first (due to foreign key constraints)
            Enrollment.query.filter_by(client_id=client_id).delete()
            
            # Delete the client
            db.session.delete(client)
            db.session.commit()
            
            return self.success_response(
                None,
                "Client successfully deleted",
                200
            )
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

class ClientSearchResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('query', type=str, required=False, default='', location='args')
        self.parser.add_argument('page', type=int, required=False, default=1, location='args')
        self.parser.add_argument('per_page', type=int, required=False, default=10, location='args')

    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def get(self):
        """
        Search for clients by name or other criteria
        Query parameters:
        - query: Search term
        - page: Page number (default: 1)
        - per_page: Items per page (default: 10)
        """
        try:
            # Parse and validate the request data
            args = self.parser.parse_args()
            
            clients = Client.query.filter(
                (Client.first_name.ilike(f'%{args["query"]}%')) |
                (Client.last_name.ilike(f'%{args["query"]}%'))
            ).paginate(page=args['page'], per_page=args['per_page'])
            
            # Format the response with the new date format
            formatted_clients = []
            for client in clients.items:
                client_dict = {
                    'id': client.id,
                    'first_name': client.first_name,
                    'last_name': client.last_name,
                    'date_of_birth': client.date_of_birth.strftime('%d/%m/%Y'),
                    'gender': client.gender,
                    'contact_number': client.contact_number,
                    'email': client.email,
                    'address': client.address,
                    'created_by': client.created_by,
                    'created_at': client.created_at.isoformat() if client.created_at else None
                }
                formatted_clients.append(client_dict)
            
            return self.success_response({
                'items': formatted_clients,
                'total': clients.total,
                'pages': clients.pages,
                'current_page': clients.page
            })
        except Exception as e:
            return self.error_response(str(e), 500)

class ClientProfileResource(Resource):
    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def get(self, client_id):
        """
        Get detailed client profile including enrolled programs
        """
        try:
            client = Client.query.get(client_id)
            if not client:
                return self.error_response("Client not found", 404)
            
            # Get client's enrollments with program details
            enrollments = Enrollment.query.filter_by(client_id=client_id).all()
            programs = [Program.query.get(e.program_id) for e in enrollments]
            
            # Format client data
            client_data = {
                'id': client.id,
                'first_name': client.first_name,
                'last_name': client.last_name,
                'date_of_birth': client.date_of_birth.strftime('%d/%m/%Y'),
                'gender': client.gender,
                'contact_number': client.contact_number,
                'email': client.email,
                'address': client.address,
                'created_by': client.created_by,
                'created_at': client.created_at.isoformat() if client.created_at else None
            }
            
            # Format program data
            program_data = [{
                'id': p.id,
                'name': p.name,
                'description': p.description,
                'created_by': p.created_by,
                'created_at': p.created_at.isoformat() if p.created_at else None
            } for p in programs]
            
            client_data['programs'] = program_data
            
            return self.success_response(client_data)
        except Exception as e:
            return self.error_response(str(e), 500)

class ClientAPIResource(Resource):
    def error_response(self, message, status_code=400):
        return {'error': message}, status_code

    def success_response(self, data, message="Success", status_code=200):
        return {
            'message': message,
            'data': data
        }, status_code

    def get(self, client_id):
        """
        External API endpoint for client information
        Returns client profile in a standardized format
        """
        try:
            client = Client.query.get(client_id)
            if not client:
                return self.error_response("Client not found", 404)
            
            # Get client's enrollments with program details
            enrollments = Enrollment.query.filter_by(client_id=client_id).all()
            programs = [Program.query.get(e.program_id) for e in enrollments]
            
            # Format response for external systems
            response_data = {
                'client_id': client.id,
                'name': f"{client.first_name} {client.last_name}",
                'date_of_birth': client.date_of_birth.strftime('%d/%m/%Y'),
                'gender': client.gender,
                'contact': {
                    'phone': client.contact_number,
                    'email': client.email,
                    'address': client.address
                },
                'enrolled_programs': [
                    {
                        'program_id': p.id,
                        'name': p.name,
                        'description': p.description,
                        'enrollment_date': e.enrollment_date.strftime('%d/%m/%Y'),
                        'status': e.status
                    }
                    for p, e in zip(programs, enrollments)
                ]
            }
            
            return self.success_response(response_data)
        except Exception as e:
            return self.error_response(str(e), 500)

# Initialize API
api = Api()

def init_client_routes(app):
    api.add_resource(ClientResource, '/api/clients', '/api/clients/<int:client_id>')
    api.add_resource(ClientSearchResource, '/api/clients/search')
    api.add_resource(ClientProfileResource, '/api/clients/<int:client_id>')
    api.add_resource(ClientAPIResource, '/api/v1/clients/<int:client_id>')
    api.init_app(app) 