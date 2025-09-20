import { z } from "zod";

// Doctor form validation schema
export const doctorFormSchema = z.object({
  // Basic Information
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  
  // Professional Information
  specialty: z.enum([
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
    'Dermatology', 'Internal Medicine', 'Emergency Medicine',
    'Radiology', 'Anesthesiology', 'Psychiatry', 'Oncology',
    'Gynecology', 'Urology', 'Ophthalmology', 'ENT'
  ], { required_error: "Please select a specialty" }),
  
  licenseNumber: z.string().min(1, "Medical license number is required"),
  experience: z.number().min(0, "Experience cannot be negative").max(50, "Experience cannot exceed 50 years"),
  department: z.string().min(1, "Department is required"),
  consultationFee: z.number().min(0, "Fee cannot be negative"),
  
  // Education
  education: z.array(z.object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    year: z.number().min(1900, "Year must be valid").max(new Date().getFullYear(), "Year cannot be in the future")
  })).min(1, "At least one education entry is required"),
  
  // Certifications (optional)
  certifications: z.array(z.object({
    name: z.string().min(1, "Certification name is required"),
    issuingOrganization: z.string().min(1, "Issuing organization is required"),
    issueDate: z.string().min(1, "Issue date is required"),
    expiryDate: z.string().optional()
  })).optional(),
  
  // Working Hours
  workingHours: z.object({
    monday: z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
      isWorking: z.boolean()
    }),
    tuesday: z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
      isWorking: z.boolean()
    }),
    wednesday: z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
      isWorking: z.boolean()
    }),
    thursday: z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
      isWorking: z.boolean()
    }),
    friday: z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
      isWorking: z.boolean()
    }),
    saturday: z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
      isWorking: z.boolean()
    }),
    sunday: z.object({
      start: z.string().min(1, "Start time is required"),
      end: z.string().min(1, "End time is required"),
      isWorking: z.boolean()
    })
  }),
  
  // Additional Information
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  languages: z.array(z.string()).optional(),
  status: z.enum(['Active', 'On Leave', 'Unavailable']).default('Active')
});

export type DoctorFormData = z.infer<typeof doctorFormSchema>;

// Constants for form options
export const specialtyOptions = [
  'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
  'Dermatology', 'Internal Medicine', 'Emergency Medicine',
  'Radiology', 'Anesthesiology', 'Psychiatry', 'Oncology',
  'Gynecology', 'Urology', 'Ophthalmology', 'ENT'
] as const;

export const languageOptions = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi'
] as const;

export const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

// Default form values
export const defaultDoctorFormValues: Partial<DoctorFormData> = {
  name: "",
  email: "",
  phone: "",
  specialty: undefined,
  licenseNumber: "",
  experience: 0,
  department: "",
  consultationFee: 0,
  education: [{ degree: "", institution: "", year: new Date().getFullYear() }],
  certifications: [],
  workingHours: {
    monday: { start: "09:00", end: "17:00", isWorking: true },
    tuesday: { start: "09:00", end: "17:00", isWorking: true },
    wednesday: { start: "09:00", end: "17:00", isWorking: true },
    thursday: { start: "09:00", end: "17:00", isWorking: true },
    friday: { start: "09:00", end: "17:00", isWorking: true },
    saturday: { start: "09:00", end: "13:00", isWorking: false },
    sunday: { start: "09:00", end: "13:00", isWorking: false }
  },
  bio: "",
  languages: [],
  status: 'Active'
};
