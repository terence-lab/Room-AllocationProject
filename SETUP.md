# Kabale University Room Allocation System - Setup Guide

## Project Overview

This is a comprehensive room allocation system for Kabale University consisting of:
- **Backend**: Django REST API with JWT authentication
- **Frontend**: React application with Ant Design UI

## System Requirements

- Python 3.8+
- Node.js 14+
- MySQL database
- Git

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd "kabale_room_allocation"
```

### 2. Create Virtual Environment
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix/MacOS
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup
- Create MySQL database named `kabale_university`
- Update database credentials in `kabale_project/settings.py` (lines 70-73)
- Current settings:
  - NAME: 'kabale_university'
  - USER: 'root'
  - PASSWORD: '2003Engs'
  - HOST: 'localhost'
  - PORT: '3306'

### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Start Django Server
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd "frontend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

## API Documentation

Once backend is running, access API documentation at:
- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## Default Login

Use the superuser credentials created during setup to login to the frontend application.

## Features Implemented

### Backend (Django)
- ✅ JWT Authentication with refresh tokens
- ✅ Faculty, Department, Semester management
- ✅ Student Groups and Class Coordinators
- ✅ Lecturer and Course management
- ✅ Room management with features
- ✅ Lecture Sessions and Allocations
- ✅ Timetable generation
- ✅ Permission-based access control
- ✅ API documentation with Swagger

### Frontend (React)
- ✅ Modern UI with Ant Design
- ✅ Responsive design for all screen sizes
- ✅ Authentication with JWT tokens
- ✅ Dashboard with statistics
- ✅ CRUD operations for all entities
- ✅ Room allocation management
- ✅ Timetable view with weekly schedule
- ✅ Error handling and loading states
- ✅ User-friendly forms and validation

## Database Schema

The system includes the following main entities:
- **Faculties**: University faculties
- **Departments**: Academic departments
- **Semesters**: Academic semesters
- **Student Groups**: Student groups with study modes
- **Lecturers**: Teaching staff
- **Courses**: Academic courses
- **Rooms**: Physical rooms with capacity and types
- **Room Features**: Additional room amenities
- **Faculty Admins**: System users with permissions
- **Class Coordinators**: Student representatives
- **Lecture Sessions**: Teaching sessions
- **Allocations**: Room-time assignments
- **Coordinator Groups**: Assignments of coordinators to groups

## Security Features

- JWT-based authentication
- Password validation
- CORS configuration
- Permission-based access control
- SQL injection protection (Django ORM)
- XSS protection

## Development Notes

### Backend
- Uses Django REST Framework
- MySQL database with proper indexing
- Custom user model (FacultyAdmin)
- Comprehensive serializers
- Permission classes for API endpoints

### Frontend
- React 18 with functional components
- Ant Design for UI components
- Axios for API calls
- Context API for state management
- React Router for navigation

## Troubleshooting

### Backend Issues
1. **Database Connection Error**: Check MySQL service and credentials
2. **Migration Errors**: Ensure database is empty before first migration
3. **Port Already in Use**: Change port or stop conflicting services

### Frontend Issues
1. **npm not found**: Install Node.js from nodejs.org
2. **Port 3000 in use**: React will automatically use next available port
3. **API Connection Error**: Ensure backend is running on port 8000

## Production Deployment

### Backend
1. Set `DEBUG = False` in settings.py
2. Configure production database
3. Set up proper `SECRET_KEY`
4. Configure `ALLOWED_HOSTS`
5. Use production web server (Gunicorn + Nginx)

### Frontend
1. Run `npm run build`
2. Deploy build folder to web server
3. Configure API endpoint to production backend

## Support

For issues and questions:
1. Check the API documentation at `/swagger/`
2. Review the database schema
3. Verify backend and frontend are both running
4. Check browser console for JavaScript errors
5. Review Django logs for backend errors
