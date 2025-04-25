from flask import Flask
from flask_cors import CORS
from models import db
from routes.program_routes import program_bp
from routes.client_routes import client_bp
from routes.enrollment_routes import enrollment_bp

app = Flask(__name__)
CORS(app) #Enable CORS for all routes

#Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Register blueprints
app.register_blueprint(program_bp)
app.register_blueprint(client_bp)
app.register_blueprint(enrollment_bp)

with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return f'Hello there!'

if __name__ == '__main__':
    app.run(debug=True)