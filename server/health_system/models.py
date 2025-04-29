from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False, default='doctor')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # Relationships
    created_clients = db.relationship('Client', backref='creator', lazy=True)
    created_programs = db.relationship('Program', backref='creator', lazy=True)
    created_enrollments = db.relationship('Enrollment', backref='creator', lazy=True)

    def set_password(self, password):
        """Hash and set the user's password"""
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        self.password = hashed_password.decode('utf-8')

    def check_password(self, password):
        """Check if the provided password matches the stored hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.username}>'

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    contact_number = db.Column(db.String(15))
    email = db.Column(db.String(100))
    address = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))

    # Relationship with programs through enrollments
    programs = db.relationship('Program', secondary='enrollment', back_populates='clients')
    
    def __repr__(self):
        return f'<Client {self.first_name} {self.last_name}>'
    


class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    duration = db.Column(db.Integer, nullable=False, default=30)  # Duration in days
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    # Relationship with clients through enrollments
    clients = db.relationship('Client', secondary='enrollment', back_populates='programs')
    
    def __repr__(self):
        return f'<Program {self.name}>'


class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('program.id'), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='Active')  # Active, Completed, Suspended
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    # Ensure a client can only be enrolled once in a program
    __table_args__ = (db.UniqueConstraint('client_id', 'program_id'),)
    
    def __repr__(self):
        return f'<Enrollment client_id={self.client_id} program_id={self.program_id}>'