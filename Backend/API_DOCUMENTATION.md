# HPMS API Documentation

## Authentication API

### Login

**Endpoint:** `POST /api/auth/login`

**Description:** Login with role-based authentication (Doctor or Patient)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "Patient"
}
```

**Field Requirements:**
- `email` (string, required): Valid email address
- `password` (string, required): Password (minimum 6 characters)
- `role` (string, required): Must be either "Doctor" or "Patient"

**Success Response (200) - Patient Login:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "patient": {
      "id": "64f8b2c1a1b2c3d4e5f6g7h8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "gender": "Male",
      "phone": "+1234567890",
      "status": "Active"
    }
  }
}
```

**Success Response (200) - Doctor Login:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8b2c1a1b2c3d4e5f6g7h8",
      "name": "Dr. Smith",
      "email": "doctor@example.com",
      "role": "Doctor",
      "department": "Cardiology"
    }
  }
}
```

**Error Responses:**

**400 - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "role",
      "message": "Role must be Doctor or Patient"
    }
  ]
}
```

**401 - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Patient Registration API

### Public Patient Registration

**Endpoint:** `POST /api/patients/public/register`

**Description:** Register a new patient (public endpoint, no authentication required)

**Request Body:**
```json
{
  "name": "John Doe",
  "age": "30",
  "gender": "Male",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}
```

**Field Requirements:**
- `name` (string, required): Patient's full name (2-100 characters)
- `age` (string/number, required): Patient's age (0-150) - can be sent as string from frontend
- `gender` (string, required): Must be one of: "Male", "Female", "Other"
- `email` (string, required): Valid email address (must be unique, will be normalized to lowercase)
- `phone` (string, required): Valid phone number (10-15 characters, international format supported)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "patient": {
      "id": "64f8b2c1a1b2c3d4e5f6g7h8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "gender": "Male",
      "phone": "+1234567890",
      "status": "Active"
    }
  }
}
```

**Error Responses:**

**400 - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**400 - Duplicate Email:**
```json
{
  "success": false,
  "message": "Patient with this email already exists"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Failed to register patient",
  "error": "Database connection error"
}
```

## Testing the API

### Using the Test Script

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install axios if not already installed:
   ```bash
   npm install axios
   ```

3. Make sure the backend server is running:
   ```bash
   npm start
   ```

4. Run the test script:
   ```bash
   node test-patient-registration.js
   ```

### Using cURL

```bash
# Test successful registration
curl -X POST http://localhost:8000/api/patients/public/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": "30",
    "gender": "Male",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }'

# Test validation errors
curl -X POST http://localhost:8000/api/patients/public/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "age": "invalid",
    "gender": "Invalid",
    "email": "invalid-email",
    "phone": "123"
  }'
```

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:8000/api/patients/public/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "name": "John Doe",
     "age": 30,
     "gender": "Male",
     "email": "john.doe@example.com",
     "phone": "+1234567890"
   }
   ```

## Frontend Integration

The frontend is now integrated with a modal-based authentication system:

1. **Header Authentication Check**: The header automatically checks for JWT token existence
2. **Dynamic Button Display**: 
   - If authenticated: Shows welcome message and logout button
   - If not authenticated: Shows "Login / Register" button
3. **Modal Authentication**: Clicking the button opens a modal with:
   - Login tab (for future implementation)
   - Register tab (fully functional patient registration)
4. **Automatic Login**: After successful registration, patient is automatically logged in
5. **Token Management**: JWT token is stored in localStorage and included in API requests

### API Configuration

The frontend API configuration is in `Frontend/src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

To change the API URL, create a `.env` file in the Frontend directory:

```env
VITE_API_URL=http://your-api-url/api
```

## Database Schema

The Patient model has been updated to make certain fields optional for basic registration:

- `address` - Optional (will be collected during appointment booking)
- `assignedDoctor` - Optional (will be assigned during appointment booking)
- `medicalCondition` - Optional (will be collected during appointment booking)
- `emergencyContact` - Optional (will be collected during appointment booking)

Required fields for basic registration:
- `name`, `age`, `gender`, `email`, `phone`

## Security Notes

- The public registration endpoint does not require authentication
- Email addresses must be unique across all patients
- Input validation is performed on both client and server side
- Rate limiting is applied to prevent abuse
- CORS is configured for the frontend domains

## Next Steps

After successful patient registration, the system can:

1. Collect additional patient information during appointment booking
2. Assign doctors based on medical condition and availability
3. Schedule appointments
4. Manage patient medical history
5. Handle insurance information
6. Track patient visits and treatments
