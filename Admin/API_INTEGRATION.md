# HPMS Admin Panel - API Integration Guide

## 🚀 Centralized API Configuration

The admin panel now uses a centralized API configuration located in `src/lib/api.ts` that connects to the backend running on `http://localhost:8000`.

## 📁 File Structure

```
Admin/src/
├── lib/
│   └── api.ts              # Centralized API configuration
├── hooks/
│   └── useAPI.ts          # React hooks for API calls
├── contexts/
│   └── AuthContext.tsx    # Authentication context
└── pages/
    ├── Login.tsx          # Login page
    ├── Dashboard.tsx      # Updated with API integration
    └── Patients.tsx       # Updated with API integration
```

## 🔧 API Configuration

### Base URL
All API calls use the centralized base URL: `http://localhost:8000/api`

### Authentication
- JWT tokens are automatically included in API requests
- Tokens are stored in localStorage
- Automatic token refresh and logout on token expiry

### Available API Modules

1. **Authentication API** (`authAPI`)
   - `login(credentials)` - User login
   - `logout()` - User logout
   - `getProfile()` - Get user profile
   - `updateProfile(data)` - Update profile
   - `changePassword(passwords)` - Change password

2. **Patient API** (`patientAPI`)
   - `getAll(params)` - Get all patients with pagination/filters
   - `getById(id)` - Get single patient
   - `create(data)` - Create new patient
   - `update(id, data)` - Update patient
   - `delete(id)` - Delete patient
   - `getStats()` - Get patient statistics

3. **Doctor API** (`doctorAPI`)
   - `getAll(params)` - Get all doctors with pagination/filters
   - `getById(id)` - Get single doctor
   - `create(data)` - Create new doctor
   - `update(id, data)` - Update doctor
   - `updateRating(id, rating)` - Update doctor rating
   - `delete(id)` - Delete doctor
   - `getStats()` - Get doctor statistics

4. **Appointment API** (`appointmentAPI`)
   - `getAll(params)` - Get all appointments with pagination/filters
   - `getById(id)` - Get single appointment
   - `create(data)` - Create new appointment
   - `update(id, data)` - Update appointment
   - `cancel(id, reason)` - Cancel appointment
   - `complete(id, data)` - Complete appointment
   - `getToday(doctor?)` - Get today's appointments
   - `getStats(params)` - Get appointment statistics

5. **User API** (`userAPI`)
   - `getAll(params)` - Get all users with pagination/filters
   - `getById(id)` - Get single user
   - `create(data)` - Create new user
   - `update(id, data)` - Update user
   - `updateStatus(id, status)` - Update user status
   - `changePassword(id, password)` - Change user password
   - `delete(id)` - Delete user
   - `getStats()` - Get user statistics

6. **Dashboard API** (`dashboardAPI`)
   - `getOverview()` - Get dashboard overview
   - `getPatientGrowth(months?)` - Get patient growth data
   - `getAppointmentAnalytics(params?)` - Get appointment analytics
   - `getDoctorPerformance()` - Get doctor performance data
   - `getAlerts()` - Get system alerts
   - `getActivities(limit?)` - Get recent activities

## 🎣 React Hooks

### `useAPI<T>(apiCall, dependencies)`
Generic hook for data fetching with loading, error, and success states.

```typescript
const { data, loading, error, success, refetch } = useAPI(() => 
  patientAPI.getAll({ page: 1, limit: 10 })
);
```

### `usePaginatedAPI<T>(apiCall, initialPage, initialLimit, filters)`
Hook for paginated data with pagination controls.

```typescript
const { 
  data, 
  pagination, 
  loading, 
  error, 
  goToPage, 
  changeLimit, 
  refetch 
} = usePaginatedAPI(
  (page, limit, filters) => patientAPI.getAll({ page, limit, ...filters }),
  1,
  10,
  { search: searchQuery }
);
```

### `useMutation<T, P>(mutationFn)`
Hook for mutations (POST, PUT, DELETE operations).

```typescript
const { mutate, loading, error, success, data } = useMutation(
  (patientData) => patientAPI.create(patientData)
);
```

## 🔐 Authentication

### AuthContext
The `AuthContext` provides authentication state and methods:

```typescript
const { user, isAuthenticated, loading, login, logout, updateUser } = useAuth();
```

### Login Flow
1. User enters credentials on login page
2. `authAPI.login()` is called with credentials
3. JWT token is stored in localStorage
4. User is redirected to dashboard
5. All subsequent API calls include the token

### Protected Routes
All admin routes are protected and require authentication. Unauthenticated users are redirected to the login page.

## 📊 Updated Pages

### Dashboard
- Fetches real-time data from `dashboardAPI.getOverview()`
- Shows loading states and error handling
- Displays actual patient, doctor, and appointment statistics

### Patients
- Uses `usePaginatedAPI` for patient data
- Implements search and filtering
- Shows loading states and error handling
- Real-time statistics from API

## 🚀 Getting Started

1. **Start the Backend** (if not already running):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd Admin
   npm run dev
   ```

3. **Login**:
   - Navigate to `http://localhost:8080`
   - Use demo credentials: `admin@healthcare.com` / `admin123`

## 🔄 API Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
```

## 🎯 Next Steps

- Update remaining pages (Doctors, Appointments, Users) with API integration
- Add form validation and error handling
- Implement real-time updates with WebSocket
- Add data export functionality
- Implement advanced filtering and search

The centralized API configuration makes it easy to maintain and update API calls across the entire application!
