from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes.program_routes import init_program_routes
from routes.client_routes import init_client_routes
from routes.enrollment_routes import init_enrollment_routes
from routes.system_user_routes import init_system_user_routes

app = Flask(__name__)
CORS(app) #Enable CORS for all routes

#Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

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