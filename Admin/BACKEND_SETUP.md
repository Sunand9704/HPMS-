# Backend Setup Instructions

## Current Issue
The Add Doctor form is showing errors because:
1. The backend server is not running
2. The API requires authentication
3. The frontend is trying to connect to the wrong port

## Quick Fix (Test Mode)
I've temporarily set the form to "test mode" so you can test the form functionality without the backend. The form will:
- Validate all inputs
- Show success message
- Log the data to console
- NOT save to database

## To Enable Full Functionality

### 1. Start the Backend Server
```bash
cd HPMS-/Backend
npm install
npm start
```
The server should start on `http://localhost:8000`

### 2. Verify Backend is Running
Visit `http://localhost:8000/health` in your browser. You should see:
```json
{
  "status": "OK",
  "message": "HPMS Backend API is running",
  "timestamp": "...",
  "uptime": ...
}
```

### 3. Authentication Setup
The API requires authentication. You need to:
1. Log in through the admin panel first
2. The auth token will be stored in localStorage
3. The form will then work with the backend

### 4. Enable Backend Integration
Once the backend is running and you're authenticated, uncomment these lines in `AddDoctorForm.tsx`:

```typescript
// Uncomment these lines:
// const { createDoctor, isLoading } = useDoctorAPI();

// Replace the test onSubmit with:
const onSubmit = async (data: DoctorFormData) => {
  try {
    const result = await createDoctor(data);
    if (result.success) {
      onSuccess?.();
    }
  } catch (error) {
    console.error('Form submission error:', error);
  }
};

// Update the button to use:
disabled={isLoading}
```

## Current Test Mode Features
- ✅ Form validation works
- ✅ All form fields functional
- ✅ Success/error messages
- ✅ Loading states
- ✅ Data logging to console
- ❌ No database saving (test mode)

## Backend API Endpoints
- `POST /api/doctors` - Create doctor
- `GET /api/doctors` - Get doctors list
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

All endpoints require authentication via Bearer token.

## Troubleshooting
1. **404 Error**: Backend not running or wrong port
2. **401 Error**: Not authenticated - log in first
3. **JSON Parse Error**: Backend returning non-JSON response
4. **CORS Error**: Backend CORS not configured for frontend port

The form is fully functional in test mode and ready for backend integration!
