from app import app, db
from models import Client, Program, Enrollment
from datetime import datetime

def seed_data():
    with app.app_context():
        # Clear existing data
        Enrollment.query.delete()
        Program.query.delete()
        Client.query.delete()
        db.session.commit()

        # Create programs
        programs = [
            Program(
                name="Diabetes Management",
                description="Comprehensive program for managing diabetes through diet, exercise, and medication",
                duration=90
            ),
            Program(
                name="Hypertension Control",
                description="Program focused on blood pressure management and lifestyle changes",
                duration=60
            ),
            Program(
                name="Weight Management",
                description="Structured program for healthy weight loss and maintenance",
                duration=120
            )
        ]
        db.session.add_all(programs)
        db.session.commit()

        # Create clients
        clients = [
            Client(
                first_name="John",
                last_name="Doe",
                date_of_birth=datetime.strptime("01/01/1990", "%d/%m/%Y").date(),
                gender="Male",
                contact_number="1234567890",
                email="john.doe@example.com",
                address="123 Main St"
            ),
            Client(
                first_name="Jane",
                last_name="Smith",
                date_of_birth=datetime.strptime("15/05/1985", "%d/%m/%Y").date(),
                gender="Female",
                contact_number="9876543210",
                email="jane.smith@example.com",
                address="456 Oak St"
            ),
            Client(
                first_name="Robert",
                last_name="Johnson",
                date_of_birth=datetime.strptime("30/11/1975", "%d/%m/%Y").date(),
                gender="Male",
                contact_number="5551234567",
                email="robert.johnson@example.com",
                address="789 Pine St"
            )
        ]
        db.session.add_all(clients)
        db.session.commit()

        # Create enrollments - enroll John Doe in all three programs
        enrollments = [
            Enrollment(
                client_id=clients[0].id,
                program_id=programs[0].id,
                status="Active"
            ),
            Enrollment(
                client_id=clients[0].id,
                program_id=programs[1].id,
                status="Active"
            ),
            Enrollment(
                client_id=clients[0].id,
                program_id=programs[2].id,
                status="Active"
            )
        ]
        db.session.add_all(enrollments)
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data() 