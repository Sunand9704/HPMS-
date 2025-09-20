# Add Doctor Form

This document describes the Add Doctor form implementation for the NeoMedix Hospital Management System.

## Overview

The Add Doctor form allows administrators to add new doctors to the system with comprehensive information including personal details, professional credentials, education, certifications, working hours, and more.

## Components

### 1. AddDoctorForm (`/src/components/Forms/AddDoctorForm.tsx`)

The main form component that handles doctor data input and validation.

**Features:**
- Comprehensive form with multiple sections
- Real-time validation using Zod schema
- Dynamic education and certification entries
- Working hours configuration
- Language selection
- Status management

**Form Sections:**
1. **Basic Information** - Name, email, phone, specialty, bio
2. **Professional Information** - License number, experience, department, consultation fee
3. **Education** - Dynamic list of educational qualifications
4. **Certifications** - Optional professional certifications
5. **Working Hours** - Weekly schedule configuration
6. **Languages** - Spoken languages selection
7. **Status** - Doctor availability status

### 2. AddDoctorDialog (`/src/components/Dialogs/AddDoctorDialog.tsx`)

A dialog wrapper that displays the Add Doctor form in a modal.

**Features:**
- Modal dialog interface
- Success/cancel callbacks
- Responsive design

### 3. Doctor Schema (`/src/schemas/doctorSchema.ts`)

Zod validation schema and TypeScript types for doctor data.

**Includes:**
- Form validation rules
- Type definitions
- Default values
- Constants for form options

### 4. API Hook (`/src/hooks/useDoctorAPI.ts`)

Custom hook for handling doctor-related API operations.

**Methods:**
- `createDoctor()` - Add new doctor
- `updateDoctor()` - Update existing doctor
- `deleteDoctor()` - Delete doctor
- `getDoctors()` - Fetch doctors list

## Schema Structure

### Doctor Form Data

```typescript
interface DoctorFormData {
  // Basic Information
  name: string;
  email: string;
  phone: string;
  specialty: Specialty;
  bio?: string;
  
  // Professional Information
  licenseNumber: string;
  experience: number;
  department: string;
  consultationFee: number;
  
  // Education
  education: EducationEntry[];
  
  // Certifications (optional)
  certifications?: CertificationEntry[];
  
  // Working Hours
  workingHours: WorkingHours;
  
  // Additional Information
  languages?: string[];
  status: DoctorStatus;
}
```

### Validation Rules

- **Name**: 2-100 characters
- **Email**: Valid email format
- **Phone**: 10+ digits, valid phone format
- **Specialty**: Must be from predefined list
- **License Number**: Required, unique
- **Experience**: 0-50 years
- **Department**: Required
- **Consultation Fee**: Non-negative number
- **Education**: At least one entry required
- **Bio**: Max 1000 characters

## Usage

### Basic Usage

```tsx
import AddDoctorDialog from '@/components/Dialogs/AddDoctorDialog';

function DoctorsPage() {
  const handleDoctorAdded = () => {
    // Refresh doctors list or show success message
    console.log('Doctor added successfully!');
  };

  return (
    <div>
      <AddDoctorDialog onDoctorAdded={handleDoctorAdded} />
    </div>
  );
}
```

### Direct Form Usage

```tsx
import AddDoctorForm from '@/components/Forms/AddDoctorForm';

function CustomPage() {
  const handleSuccess = () => {
    // Handle successful form submission
  };

  const handleCancel = () => {
    // Handle form cancellation
  };

  return (
    <AddDoctorForm 
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
```

## API Integration

The form integrates with the backend API through the `useDoctorAPI` hook:

```typescript
const { createDoctor, isLoading } = useDoctorAPI();

const handleSubmit = async (data: DoctorFormData) => {
  const result = await createDoctor(data);
  if (result.success) {
    // Handle success
  }
};
```

## Backend Schema

The form data maps to the MongoDB Doctor model with the following structure:

```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  specialty: String (required, enum),
  licenseNumber: String (required, unique),
  experience: Number (required),
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date
  }],
  workingHours: {
    monday: { start: String, end: String, isWorking: Boolean },
    // ... other days
  },
  consultationFee: Number (required),
  department: String (required),
  bio: String (optional),
  languages: [String],
  status: String (enum: 'Active', 'On Leave', 'Unavailable'),
  rating: Number (default: 0),
  totalRatings: Number (default: 0),
  isActive: Boolean (default: true)
}
```

## Form Features

### Dynamic Fields
- **Education Entries**: Add/remove multiple education records
- **Certifications**: Optional certification entries
- **Languages**: Multi-select language badges

### Working Hours
- Toggle working days on/off
- Set start and end times for each day
- Default schedule: Monday-Friday 9:00-17:00

### Validation
- Real-time form validation
- Error messages for each field
- Required field indicators
- Format validation for email, phone, dates

### User Experience
- Responsive design
- Loading states during submission
- Success/error toast notifications
- Form reset after successful submission

## Dependencies

- React Hook Form - Form state management
- Zod - Schema validation
- Radix UI - Dialog and form components
- Lucide React - Icons
- Tailwind CSS - Styling

## Future Enhancements

- File upload for doctor photos
- Bulk import functionality
- Advanced scheduling options
- Integration with calendar systems
- Doctor profile preview
- Form auto-save functionality
