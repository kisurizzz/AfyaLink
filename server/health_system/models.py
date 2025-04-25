from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

class SystemUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False, default='doctor')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # Relationships
    created_clients = db.relationship('Client', backref='creator', lazy=True)
    created_programs = db.relationship('Program', backref='creator', lazy=True)
    created_enrollments = db.relationship('Enrollment', backref='creator', lazy=True)

    def __repr__(self):
        return f'<Doctor {self.username}>'

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
    created_by = db.Column(db.Integer, db.ForeignKey('system_user.id'))

    # Relationship with programs through enrollments
    programs = db.relationship('Program', secondary='enrollment', back_populates='clients')
    
    def __repr__(self):
        return f'<Client {self.first_name} {self.last_name}>'
    


class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('system_user.id'))
    
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
    created_by = db.Column(db.Integer, db.ForeignKey('system_user.id'))
    
    # Ensure a client can only be enrolled once in a program
    __table_args__ = (db.UniqueConstraint('client_id', 'program_id'),)
    
    def __repr__(self):
        return f'<Enrollment client_id={self.client_id} program_id={self.program_id}>'