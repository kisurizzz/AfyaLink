from flask import Blueprint, request, jsonify
from models import db, Client, Program, Enrollment
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from flask.views import MethodView

client_bp = Blueprint('client', __name__)

class ClientView(MethodView):
    def error_response(self, message, status_code=400):
        return jsonify({'error': message}), status_code

    def success_response(self, data, message="Success", status_code=200):
        return jsonify({
            'message': message,
            'data': data
        }), status_code

    def post(self):
        """
        Register a new client
        Expected JSON body:
        {
            "first_name": "John",
            "last_name": "Doe",
            "date_of_birth": "1990-01-01",
            "gender": "Male",
            "contact_number": "1234567890",
            "email": "john@example.com",
            "address": "123 Main St"
        }
        """
        data = request.get_json()
        
        required_fields = ['first_name', 'last_name', 'date_of_birth', 'gender']
        for field in required_fields:
            if field not in data:
                return self.error_response(f"{field} is required")
        
        try:
            client = Client(
                first_name=data['first_name'],
                last_name=data['last_name'],
                date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date(),
                gender=data['gender'],
                contact_number=data.get('contact_number'),
                email=data.get('email'),
                address=data.get('address')
            )
            db.session.add(client)
            db.session.commit()
            return self.success_response(
                client.__dict__,
                "Client registered successfully",
                201
            )
        except ValueError:
            return self.error_response("Invalid date format. Use YYYY-MM-DD")
        except Exception as e:
            db.session.rollback()
            return self.error_response(str(e), 500)

    def get(self, client_id=None):
        """
        Get client profile or search clients
        If client_id is provided, returns specific client profile
        Otherwise, performs a search based on query parameters
        """
        if client_id:
            return self.get_client_profile(client_id)
        return self.search_clients()

    def search_clients(self):
        """
        Search for clients by name or other criteria
        Query parameters:
        - query: Search term
        - page: Page number (default: 1)
        - per_page: Items per page (default: 10)
        """
        query = request.args.get('query', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        try:
            clients = Client.query.filter(
                (Client.first_name.ilike(f'%{query}%')) |
                (Client.last_name.ilike(f'%{query}%'))
            ).paginate(page=page, per_page=per_page)
            
            return self.success_response({
                'items': [client.__dict__ for client in clients.items],
                'total': clients.total,
                'pages': clients.pages,
                'current_page': clients.page
            })
        except Exception as e:
            return self.error_response(str(e), 500)

    def get_client_profile(self, client_id):
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
            
            client_data = client.__dict__
            client_data['programs'] = [p.__dict__ for p in programs]
            
            return self.success_response(client_data)
        except Exception as e:
            return self.error_response(str(e), 500)

class ClientAPIView(MethodView):
    def error_response(self, message, status_code=400):
        return jsonify({'error': message}), status_code

    def success_response(self, data, message="Success", status_code=200):
        return jsonify({
            'message': message,
            'data': data
        }), status_code

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
                'date_of_birth': client.date_of_birth.isoformat(),
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
                        'enrollment_date': e.enrollment_date.isoformat(),
                        'status': e.status
                    }
                    for p, e in zip(programs, enrollments)
                ]
            }
            
            return self.success_response(response_data)
        except Exception as e:
            return self.error_response(str(e), 500)

# Register the views
client_view = ClientView.as_view('client_api')
client_api_view = ClientAPIView.as_view('client_api_v1')

client_bp.add_url_rule('/api/clients', view_func=client_view, methods=['POST'])
client_bp.add_url_rule('/api/clients/search', view_func=client_view, methods=['GET'])
client_bp.add_url_rule('/api/clients/<int:client_id>', view_func=client_view, methods=['GET'])
client_bp.add_url_rule('/api/v1/clients/<int:client_id>', view_func=client_api_view, methods=['GET']) 