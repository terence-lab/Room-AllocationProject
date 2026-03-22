# Kabale University Room Allocation System - Frontend

A modern React-based frontend application for managing room allocations at Kabale University.

## Features

- **Authentication System**: Secure JWT-based login/logout functionality
- **Dashboard**: Overview with statistics and recent allocations
- **Room Management**: CRUD operations for rooms with capacity and type management
- **Course Management**: Manage courses across different departments
- **Lecturer Management**: Add, edit, and manage lecturer information
- **Student Management**: Handle student groups and class coordinators
- **Room Allocations**: Create and manage room schedules with time slots
- **Timetable View**: Visual weekly timetable with room schedules
- **Responsive Design**: Mobile-friendly interface using Ant Design

## Technology Stack

- **React 18**: Modern React with hooks
- **Ant Design 5**: UI component library
- **React Router 6**: Client-side routing
- **Axios**: HTTP client for API requests
- **Moment.js**: Date and time handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Django backend server running on port 8000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Configuration

The API base URL is configured in `src/services/api.js`. By default, it connects to `http://localhost:8000/api/kabale`.

To change the API endpoint, set the `REACT_APP_API_URL` environment variable:

```bash
REACT_APP_API_URL=http://your-api-server.com/api/kabale npm start
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.js       # Application header
│   └── Sidebar.js      # Navigation sidebar
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── Rooms.js        # Room management
│   ├── Courses.js      # Course management
│   ├── Lecturers.js    # Lecturer management
│   ├── Students.js     # Student and group management
│   ├── Allocations.js  # Room allocation management
│   ├── Timetable.js    # Timetable view
│   └── Login.js        # Login page
├── services/           # API services
│   └── api.js          # Axios configuration
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Usage

1. **Login**: Use your faculty admin credentials to access the system
2. **Dashboard**: View statistics and recent allocations
3. **Manage Entities**: Use the respective pages to manage rooms, courses, lecturers, and students
4. **Create Allocations**: Assign rooms to courses with specific time slots
5. **View Timetable**: Check room schedules and availability

## API Integration

The frontend integrates with the Django REST API backend:

- Authentication: `/api/kabale/auth/login/`
- Rooms: `/api/kabale/rooms/`
- Courses: `/api/kabale/courses/`
- Lecturers: `/api/kabale/lecturers/`
- Student Groups: `/api/kabale/student-groups/`
- Class Coordinators: `/api/kabale/class-coordinators/`
- Allocations: `/api/kabale/allocations/`
- Timetable: `/api/kabale/allocations/timetable/`

## Features Details

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- User session management

### Room Management
- Add/edit/delete rooms
- Filter by room type and capacity
- Assign rooms to faculties
- View room features

### Course Management
- Manage courses by department
- Course code and name management
- Department association

### Lecturer Management
- Lecturer profile management
- Department assignment
- Active/inactive status

### Student Management
- Student group management
- Class coordinator assignment
- Study mode tracking (Full-time/Weekend)

### Allocation System
- Time-slot based room allocation
- Weekly/bi-weekly/one-time scheduling
- Conflict prevention
- Recurrence patterns

### Timetable View
- Weekly schedule visualization
- Room-specific timetables
- Day-wise allocation display
- Time slot management

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Styling

The application uses Ant Design components with custom CSS for:
- Responsive layout
- Color scheme consistency
- Component-specific styling
- Mobile optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of Kabale University's Room Allocation System.
