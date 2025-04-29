from app import app, db
from sqlalchemy import inspect

def verify_schema():
    with app.app_context():
        inspector = inspect(db.engine)
        
        # Get all table names
        tables = inspector.get_table_names()
        print("\nDatabase Tables:")
        print("----------------")
        for table in tables:
            print(f"\nTable: {table}")
            print("Columns:")
            for column in inspector.get_columns(table):
                print(f"  - {column['name']}: {column['type']}")
            
            # Get foreign keys
            foreign_keys = inspector.get_foreign_keys(table)
            if foreign_keys:
                print("\nForeign Keys:")
                for fk in foreign_keys:
                    print(f"  - {fk['constrained_columns']} -> {fk['referred_table']}.{fk['referred_columns']}")

if __name__ == "__main__":
    verify_schema() 