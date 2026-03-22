# 🚀 Quick Start Guide - Kabale University Room Allocation System

## ⚡ Fastest Way to Start (Windows)

### Step 1: Install Prerequisites
1. **Python 3.8+**: Download from https://python.org
2. **Node.js 14+**: Download from https://nodejs.org
3. **MySQL 5.7+**: Download from https://mysql.com

### Step 2: Database Setup
1. Install MySQL and start the service
2. Open MySQL Command Line Client
3. Run: `CREATE DATABASE kabale_university;`
4. Create a user (optional): 
   ```sql
   CREATE USER 'root'@'localhost' IDENTIFIED BY '2003Engs';
   GRANT ALL PRIVILEGES ON kabale_university.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Step 3: Backend Setup
Open Command Prompt and run:
```cmd
cd "c:\Users\HP\Desktop\Workplace\Room Allocator\kabale_room_allocation"

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database with sample data
python setup-database.py

# Start backend server
python manage.py runserver
```

### Step 4: Frontend Setup (New Terminal)
Open another Command Prompt and run:
```cmd
cd "c:\Users\HP\Desktop\Workplace\Room Allocator\frontend"

# Install dependencies
npm install

# Start frontend
npm start
```

## 🌐 Access the System

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/kabale/
- **API Docs**: http://localhost:8000/swagger/
- **Admin Panel**: http://localhost:8000/admin/

## 🔑 Login Credentials

- **Email**: admin@kabale.ac.ug
- **Password**: admin123

## 🎯 What You Can Do

1. **Dashboard**: View system statistics
2. **Rooms**: Add/edit lecture rooms, labs, halls
3. **Courses**: Manage courses by department
4. **Lecturers**: Add and assign teaching staff
5. **Students**: Manage student groups and coordinators
6. **Allocations**: Schedule rooms for courses
7. **Timetable**: View weekly room schedules

## 🔧 One-Click Startup (Windows)

Simply double-click the `start-dev.bat` file to start both backend and frontend automatically!

## ❓ Troubleshooting

### "Python not found"
- Install Python from python.org
- Add Python to PATH during installation
- Restart Command Prompt

### "npm not found"
- Install Node.js from nodejs.org
- Restart Command Prompt

### Database connection error
- Ensure MySQL service is running
- Check database name: `kabale_university`
- Verify username/password in settings.py

### Port already in use
- Backend: Change port: `python manage.py runserver 8001`
- Frontend: React will automatically use next available port

## 📱 Mobile Access

The system is fully responsive! Access from any device using the same URL.

## 🎉 Success!

Once both servers are running, you'll see:
- Backend: "Starting development server at http://127.0.0.1:8000/"
- Frontend: "Starting the development server" and browser opens automatically

Enjoy managing room allocations at Kabale University! 🏛️
