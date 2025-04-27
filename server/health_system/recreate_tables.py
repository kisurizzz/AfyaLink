from health_system.models import db
from health_system import app  # Adjust this import if your app is elsewhere

with app.app_context():
    print("Dropping all tables...")
    db.drop_all()
    print("Creating all tables...")
    db.create_all()
    print("Done!")