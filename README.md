# Kabale University Room Allocation System

A comprehensive room allocation management system for Kabale University with Django REST API backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL 5.7+
- Git

### Option 1: Automatic Setup (Windows)
1. Double-click `start-dev.bat` to start both backend and frontend
2. Access the application at `http://localhost:3000`

### Option 2: Manual Setup

#### Backend Setup
```bash
# Navigate to backend directory
cd kabale_room_allocation

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database (creates admin user)
python setup-database.py

# Start server
python manage.py runserver
```

#### Frontend Setup
```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/kabale/
- **API Documentation**: http://localhost:8000/swagger/
- **Admin Panel**: http://localhost:8000/admin/

## 🔑 Default Login

- **Email**: admin@kabale.ac.ug
- **Password**: admin123

## 📋 Features

### 🎯 Core Functionality
- **Authentication**: JWT-based secure login system
- **Dashboard**: Real-time statistics and overview
- **Room Management**: Add, edit, delete rooms with capacity tracking
- **Course Management**: Organize courses by departments
- **Lecturer Management**: Staff management and assignments
- **Student Management**: Groups and class coordinators
- **Room Allocations**: Time-based scheduling system
- **Timetable View**: Visual weekly schedules

### 🛠️ Technical Features
- **RESTful API**: Complete CRUD operations
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live data synchronization
- **Error Handling**: Comprehensive error management
- **Security**: Permission-based access control
- **Documentation**: Auto-generated API docs

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Django API     │    │   MySQL DB      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│  (Database)     │
│  Port: 3000     │    │  Port: 8000     │    │  Port: 3306     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
Room Allocator/
├── kabale_room_allocation/          # Django Backend
│   ├── api/                        # API app
│   │   ├── models.py               # Database models
│   │   ├── views.py                # API views
│   │   ├── serializers.py          # Data serializers
│   │   └── urls.py                # API routes
│   ├── kabale_project/             # Django project
│   │   ├── settings.py             # Project settings
│   │   └── urls.py                # Main URLs
│   └── manage.py                   # Django management
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   ├── contexts/               # React contexts
│   │   ├── services/               # API services
│   │   └── App.js                 # Main app
│   └── package.json               # Dependencies
├── start-dev.bat                   # Windows startup script
├── setup-database.py              # Database setup script
└── README.md                      # This file
```

## 🔧 Configuration

### Database Settings
Update database credentials in `kabale_room_allocation/kabale_project/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'kabale_university',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### API Configuration
Frontend API endpoint is configured in `frontend/src/services/api.js`:
- Default: `http://localhost:8000/api/kabale`
- Change `REACT_APP_API_URL` environment variable for production

## 🚀 Deployment

### Backend Production
1. Set `DEBUG = False` in settings.py
2. Configure production database
3. Set `SECRET_KEY` and `ALLOWED_HOSTS`
4. Use Gunicorn + Nginx for serving

### Frontend Production
1. Run `npm run build`
2. Deploy `build/` folder to web server
3. Configure API endpoint to production backend

## 🧪 Testing

### Backend Tests
```bash
cd kabale_room_allocation
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /api/kabale/auth/login/` - User login
- `POST /api/token/refresh/` - Refresh token

### Management
- `GET/POST /api/kabale/rooms/` - Room management
- `GET/POST /api/kabale/courses/` - Course management
- `GET/POST /api/kabale/lecturers/` - Lecturer management
- `GET/POST /api/kabale/student-groups/` - Student groups
- `GET/POST /api/kabale/allocations/` - Room allocations
- `GET /api/kabale/allocations/timetable/` - Timetable data

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
```bash
# Check if MySQL is running
# Verify database credentials
# Run migrations: python manage.py migrate
```

**Frontend won't start**
```bash
# Check if Node.js is installed: node --version
# Clear npm cache: npm cache clean --force
# Delete node_modules and reinstall: rm -rf node_modules && npm install
```

**Database connection errors**
```bash
# Verify MySQL service is running
# Check database exists: CREATE DATABASE kabale_university;
# Verify user permissions
```

**CORS errors**
- Ensure backend is running on port 8000
- Check CORS settings in Django settings.py

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary to Kabale University.

## 📞 Support

For technical support:
1. Check the troubleshooting section
2. Review API documentation at `/swagger/`
3. Check browser console for JavaScript errors
4. Review Django logs for backend errors

---

**Developed for Kabale University**  
*Room Allocation Management System*
