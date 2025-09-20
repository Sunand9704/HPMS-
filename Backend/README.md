# HPMS Backend API

Hospital Patient Management System Backend API built with Node.js, Express, and MongoDB.

## Features

- **Patient Management**: CRUD operations for patient records
- **Doctor Management**: Doctor profiles, specialties, and ratings
- **Appointment Scheduling**: Complete appointment lifecycle management
- **User Management**: System users with role-based permissions
- **Dashboard Analytics**: Comprehensive healthcare analytics
- **Authentication**: JWT-based secure authentication
- **Activity Logging**: Complete audit trail of system activities

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/refresh` - Refresh JWT token

### Patients
- `GET /api/patients` - Get all patients (with pagination, search, filters)
- `GET /api/patients/stats` - Get patient statistics
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors (with pagination, search, filters)
- `GET /api/doctors/stats` - Get doctor statistics
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `PUT /api/doctors/:id/rating` - Update doctor rating
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments (with pagination, search, filters)
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/appointments/stats` - Get appointment statistics
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `PUT /api/appointments/:id/complete` - Complete appointment

### Users
- `GET /api/users` - Get all users (with pagination, search, filters)
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/status` - Update user status
- `PUT /api/users/:id/password` - Change user password
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/patient-growth` - Get patient growth data
- `GET /api/dashboard/appointment-analytics` - Get appointment analytics
- `GET /api/dashboard/doctor-performance` - Get doctor performance data
- `GET /api/dashboard/alerts` - Get system alerts
- `GET /api/dashboard/activities` - Get recent activities

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

The following environment variables are used:

- `PORT` - Server port (default: 8000)
- `JWT_SECRET` - JWT secret key (default: 'hpms_secret_key')
- `NODE_ENV` - Environment (development/production)

## Database

The application uses MongoDB Atlas with the following connection string:
```
mongodb+srv://sunandvemavarapu_db_user:wG2gnW5sjhD4OsNm@6hrs.lfpjg7a.mongodb.net/
```

## API Documentation

### Authentication
All API endpoints (except auth routes) require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... }
}
```

### Error Handling
Errors are returned with appropriate HTTP status codes and error messages:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Account lockout after failed login attempts

## Models

### Patient
- Personal information (name, age, gender, contact)
- Medical information (condition, history, allergies)
- Assigned doctor and status
- Emergency contacts and insurance

### Doctor
- Professional information (name, specialty, license)
- Experience and education
- Working hours and availability
- Ratings and performance metrics

### Appointment
- Patient and doctor references
- Date, time, and duration
- Type and reason
- Status tracking (scheduled, in-progress, completed, cancelled)
- Medical notes and prescriptions

### User
- System user information
- Role-based permissions
- Department and status
- Login tracking and security

### Activity
- System activity logging
- User actions tracking
- Audit trail for compliance

## Testing

Run tests with:
```bash
npm test
```

## Health Check

Check API health:
```
GET /health
```

Returns server status, uptime, and timestamp.
