# Authentication Flow Test Guide

## Testing the New Modal-Based Authentication

### 1. **Initial State (No Authentication)**
- Open the website
- Check the header - you should see "Login / Register" button
- No user information should be displayed

### 2. **Opening the Modal**
- Click the "Login / Register" button
- A modal should open with two tabs: "Login" and "Register"
- The "Register" tab should be functional

### 3. **Patient Registration**
- Fill out the registration form with:
  - Name: "John Doe"
  - Age: "30"
  - Gender: "Male"
  - Email: "john.doe@example.com"
  - Phone: "+1234567890"
- Accept terms and conditions
- Click "Register as Patient"
- Should see success message and modal should close

### 4. **After Registration (Authenticated State)**
- Header should now show "Welcome, John Doe" and "Logout" button
- Patient should be automatically logged in
- JWT token should be stored in localStorage

### 5. **Logout Functionality**
- Click the "Logout" button
- Should return to initial state
- "Login / Register" button should reappear
- JWT token should be removed from localStorage

### 6. **Mobile View**
- Test the same flow on mobile
- Mobile menu should show appropriate buttons based on authentication state

## Expected Behavior

### ✅ **When Not Authenticated:**
- Header shows "Login / Register" button
- Mobile menu shows "Login / Register" button
- Clicking opens the authentication modal

### ✅ **When Authenticated:**
- Header shows "Welcome, [Patient Name]" and "Logout" button
- Mobile menu shows welcome message and "Logout" button
- Patient data is available throughout the app

### ✅ **Modal Functionality:**
- Login tab shows (but login is not implemented yet)
- Register tab is fully functional
- Form validation works correctly
- Success/error messages display properly
- Modal closes after successful registration

## Technical Details

- **JWT Token Storage**: `localStorage.getItem('hpms_patient_token')`
- **Authentication Context**: `usePatientAuth()` hook provides auth state
- **API Integration**: All API calls include JWT token in headers
- **Responsive Design**: Works on both desktop and mobile

## Troubleshooting

### If authentication doesn't work:
1. Check browser console for errors
2. Verify backend is running on port 8000
3. Check localStorage for token storage
4. Verify API responses include token

### If modal doesn't open:
1. Check if LoginModal component is properly imported
2. Verify state management in Header component
3. Check for JavaScript errors in console

### If registration fails:
1. Check backend logs for validation errors
2. Verify API endpoint is accessible
3. Check network tab for failed requests
