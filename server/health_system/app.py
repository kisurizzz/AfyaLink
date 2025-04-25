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
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
if not app.config['JWT_SECRET_KEY']:
    raise ValueError("JWT_SECRET_KEY environment variable is not set")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1) #This is the expiration time for the access token

db.init_app(app)
jwt = JWTManager(app)

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