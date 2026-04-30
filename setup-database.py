#!/usr/bin/env python
"""
Database setup script for Kabale University Room Allocation System
Run this script to set up the database with initial data
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_database():
    """Set up the database with migrations and initial data"""
    
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kabale_project.settings')
    django.setup()
    
    print("🔧 Setting up Kabale University Room Allocation System Database")
    print("=" * 60)
    
    try:
        # Run migrations
        print("📋 Running migrations...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations completed successfully!")
        
        # Create superuser
        print("\n👤 Creating superuser...")
        from django.contrib.auth import get_user_model
        from api.models import Faculty, Department
        
        # Check if superuser exists
        FacultyAdmin = get_user_model()
        if not FacultyAdmin.objects.filter(email='admin@kabale.ac.ug').exists():
            # Create a faculty first
            faculty, created = Faculty.objects.get_or_create(
                faculty_id='ADMIN',
                defaults={
                    'faculty_name': 'Administration',
                    'faculty_code': 'ADMIN'
                }
            )
            
            # Create superuser
            admin_user = FacultyAdmin.objects.create_superuser(
                email='admin@kabale.ac.ug',
                full_name='System Administrator',
                faculty_id='ADMIN',
                password='admin123'
            )
            print("✅ Superuser created successfully!")
            print("   Email: admin@kabale.ac.ug")
            print("   Password: admin123")
        else:
            print("ℹ️  Superuser already exists!")
        
        # Create sample data
        print("\n📚 Creating sample data...")
        
        # Create sample faculties
        faculties_data = [
            ('SCI', 'Science & Technology', 'SCITECH'),
            ('BUS', 'Business & Management', 'BUSMGT'),
            ('ART', 'Arts & Humanities', 'ARTSHUM'),
        ]
        
        for faculty_id, faculty_name, faculty_code in faculties_data:
            faculty, created = Faculty.objects.get_or_create(
                faculty_id=faculty_id,
                defaults={
                    'faculty_name': faculty_name,
                    'faculty_code': faculty_code
                }
            )
            if created:
                print(f"   ✅ Created faculty: {faculty_name}")
        
        # Create sample departments
        from api.models import Department
        departments_data = [
            ('CS', 'Computer Science', 'SCI'),
            ('IT', 'Information Technology', 'SCI'),
            ('BBA', 'Business Administration', 'BUS'),
            ('ACC', 'Accounting', 'BUS'),
            ('ENG', 'English Literature', 'ART'),
        ]
        
        for dept_id, dept_name, faculty_id in departments_data:
            dept, created = Department.objects.get_or_create(
                dept_id=dept_id,
                defaults={
                    'dept_name': dept_name,
                    'faculty_id': faculty_id
                }
            )
            if created:
                print(f"   ✅ Created department: {dept_name}")
        
        print("\n🎉 Database setup completed successfully!")
        print("\nNext steps:")
        print("1. Run 'python manage.py runserver' to start the backend")
        print("2. Navigate to frontend directory and run 'npm start'")
        print("3. Login with: admin@kabale.ac.ug / admin123")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        sys.exit(1)

if __name__ == '__main__':
    setup_database()
