from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import db
from routes.program_routes import init_program_routes
from routes.client_routes import init_client_routes
from routes.enrollment_routes import init_enrollment_routes
from routes.system_user_routes import init_system_user_routes
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app) #Enable CORS for all routes

#Configure the database
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_system.db'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Token expiration time
app.config['JWT_TOKEN_LOCATION'] = ['headers']  # Look for tokens in headers
app.config['JWT_HEADER_NAME'] = 'Authorization'  # Header name
app.config['JWT_HEADER_TYPE'] = 'Bearer'  # Header type

db.init_app(app)
jwt = JWTManager(app)

# JWT error handlers
@jwt.invalid_token_loader
def invalid_token_callback(error):
    return {'error': 'Invalid token'}, 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    return {'error': 'Token has expired'}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return {'error': 'Authorization token is missing'}, 401

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize routes
init_system_user_routes(app)
init_program_routes(app)
init_client_routes(app)
init_enrollment_routes(app)

with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return f'Hello there!'

if __name__ == '__main__':
    app.run(debug=True)