@echo off
echo Starting Kabale University Room Allocation System
echo =============================================

echo.
echo 1. Starting Django Backend Server...
cd "kabale_room_allocation"
start "Django Backend" cmd /k "python manage.py runserver"

echo.
echo 2. Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 3. Starting React Frontend...
cd "../frontend"
start "React Frontend" cmd /k "npm start"

echo.
echo =============================================
echo System is starting up...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo API Documentation: http://localhost:8000/swagger/
echo =============================================
echo.
echo Press any key to exit this window...
pause >nul
