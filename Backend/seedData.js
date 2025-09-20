const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

// Seed data
const seedUsers = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@healthcare.com",
    password: "doctor123",
    role: "Doctor",
    department: "Cardiology",
    employeeId: "DOC001",
    phone: "555-123-4567",
    address: {
      street: "123 Medical Center Dr",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    profile: {
      bio: "Experienced cardiologist with 15 years of practice",
      dateOfBirth: new Date("1980-05-15"),
      gender: "Female"
    }
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@healthcare.com",
    password: "doctor123",
    role: "Doctor",
    department: "Neurology",
    employeeId: "DOC002",
    phone: "555-234-5678",
    address: {
      street: "456 Health Plaza",
      city: "New York",
      state: "NY",
      zipCode: "10002"
    },
    profile: {
      bio: "Neurologist specializing in brain disorders",
      dateOfBirth: new Date("1978-03-22"),
      gender: "Male"
    }
  },
  {
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@healthcare.com",
    password: "doctor123",
    role: "Doctor",
    department: "Pediatrics",
    employeeId: "DOC003",
    phone: "555-345-6789",
    address: {
      street: "789 Children's Way",
      city: "New York",
      state: "NY",
      zipCode: "10003"
    },
    profile: {
      bio: "Pediatrician with 18 years of experience",
      dateOfBirth: new Date("1975-08-10"),
      gender: "Female"
    }
  },
  {
    name: "Nurse Emily Davis",
    email: "emily.davis@healthcare.com",
    password: "nurse123",
    role: "Nurse",
    department: "Emergency",
    employeeId: "NUR001",
    phone: "555-456-7890",
    address: {
      street: "321 Care Street",
      city: "New York",
      state: "NY",
      zipCode: "10004"
    },
    profile: {
      bio: "Emergency room nurse with 10 years experience",
      dateOfBirth: new Date("1985-12-05"),
      gender: "Female"
    }
  },
  {
    name: "Nurse Robert Wilson",
    email: "robert.wilson@healthcare.com",
    password: "nurse123",
    role: "Nurse",
    department: "Cardiology",
    employeeId: "NUR002",
    phone: "555-567-8901",
    address: {
      street: "654 Heart Lane",
      city: "New York",
      state: "NY",
      zipCode: "10005"
    },
    profile: {
      bio: "Cardiology nurse specialist",
      dateOfBirth: new Date("1982-07-18"),
      gender: "Male"
    }
  },
  {
    name: "Admin User",
    email: "admin@healthcare.com",
    password: "admin123",
    role: "Admin",
    department: "Administration",
    employeeId: "ADM001",
    phone: "555-000-0000",
    address: {
      street: "999 Admin Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10000"
    },
    profile: {
      bio: "System administrator",
      dateOfBirth: new Date("1980-01-01"),
      gender: "Male"
    }
  }
];

const seedDoctors = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@healthcare.com",
    phone: "555-123-4567",
    specialty: "Cardiology",
    licenseNumber: "MD123456",
    experience: 15,
    education: [
      { degree: "MD", institution: "Harvard Medical School", year: 2005 },
      { degree: "Residency", institution: "Johns Hopkins Hospital", year: 2008 }
    ],
    rating: 4.9,
    totalRatings: 150,
    status: "Active",
    workingHours: {
      monday: { start: "08:00", end: "17:00", isWorking: true },
      tuesday: { start: "08:00", end: "17:00", isWorking: true },
      wednesday: { start: "08:00", end: "17:00", isWorking: true },
      thursday: { start: "08:00", end: "17:00", isWorking: true },
      friday: { start: "08:00", end: "17:00", isWorking: true },
      saturday: { start: "09:00", end: "13:00", isWorking: true },
      sunday: { start: "09:00", end: "13:00", isWorking: false }
    },
    consultationFee: 200,
    department: "Cardiology",
    bio: "Experienced cardiologist specializing in heart disease treatment",
    languages: ["English", "Spanish"]
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@healthcare.com",
    phone: "555-234-5678",
    specialty: "Neurology",
    licenseNumber: "MD234567",
    experience: 12,
    education: [
      { degree: "MD", institution: "Stanford Medical School", year: 2008 },
      { degree: "Fellowship", institution: "Mayo Clinic", year: 2012 }
    ],
    rating: 4.8,
    totalRatings: 120,
    status: "Active",
    workingHours: {
      monday: { start: "09:00", end: "18:00", isWorking: true },
      tuesday: { start: "09:00", end: "18:00", isWorking: true },
      wednesday: { start: "09:00", end: "18:00", isWorking: true },
      thursday: { start: "09:00", end: "18:00", isWorking: true },
      friday: { start: "09:00", end: "18:00", isWorking: true },
      saturday: { start: "10:00", end: "14:00", isWorking: false },
      sunday: { start: "10:00", end: "14:00", isWorking: false }
    },
    consultationFee: 180,
    department: "Neurology",
    bio: "Neurologist specializing in brain and nervous system disorders",
    languages: ["English", "Chinese"]
  },
  {
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@healthcare.com",
    phone: "555-345-6789",
    specialty: "Pediatrics",
    licenseNumber: "MD345678",
    experience: 18,
    education: [
      { degree: "MD", institution: "Yale Medical School", year: 2002 },
      { degree: "Residency", institution: "Children's Hospital", year: 2005 }
    ],
    rating: 4.9,
    totalRatings: 200,
    status: "Active",
    workingHours: {
      monday: { start: "08:30", end: "17:30", isWorking: true },
      tuesday: { start: "08:30", end: "17:30", isWorking: true },
      wednesday: { start: "08:30", end: "17:30", isWorking: true },
      thursday: { start: "08:30", end: "17:30", isWorking: true },
      friday: { start: "08:30", end: "17:30", isWorking: true },
      saturday: { start: "09:00", end: "15:00", isWorking: true },
      sunday: { start: "09:00", end: "15:00", isWorking: false }
    },
    consultationFee: 150,
    department: "Pediatrics",
    bio: "Pediatrician with extensive experience in child healthcare",
    languages: ["English", "French"]
  }
];

const seedPatients = [
  {
    name: "Emma Thompson",
    age: 34,
    gender: "Female",
    email: "emma.thompson@email.com",
    phone: "555-111-2222",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    medicalCondition: "Hypertension",
    status: "Active",
    emergencyContact: {
      name: "John Thompson",
      relationship: "Husband",
      phone: "555-111-2223"
    },
    medicalHistory: [
      {
        condition: "Hypertension",
        diagnosisDate: new Date("2023-01-15"),
        treatment: "ACE inhibitors",
        notes: "Well controlled with medication"
      }
    ],
    allergies: [
      { allergen: "Penicillin", severity: "Moderate" }
    ],
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Johnson",
        startDate: new Date("2023-01-20")
      }
    ]
  },
  {
    name: "James Wilson",
    age: 45,
    gender: "Male",
    email: "james.wilson@email.com",
    phone: "555-222-3333",
    address: {
      street: "456 Oak Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10002"
    },
    medicalCondition: "Diabetes Type 2",
    status: "Follow-up",
    emergencyContact: {
      name: "Mary Wilson",
      relationship: "Wife",
      phone: "555-222-3334"
    },
    medicalHistory: [
      {
        condition: "Diabetes Type 2",
        diagnosisDate: new Date("2022-06-10"),
        treatment: "Metformin, diet control",
        notes: "HbA1c improving with treatment"
      }
    ],
    allergies: [],
    medications: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        prescribedBy: "Dr. Lisa Anderson",
        startDate: new Date("2022-06-15")
      }
    ]
  },
  {
    name: "Maria Garcia",
    age: 28,
    gender: "Female",
    email: "maria.garcia@email.com",
    phone: "555-333-4444",
    address: {
      street: "789 Pine Street",
      city: "New York",
      state: "NY",
      zipCode: "10003"
    },
    medicalCondition: "Migraine",
    status: "Active",
    emergencyContact: {
      name: "Carlos Garcia",
      relationship: "Brother",
      phone: "555-333-4445"
    },
    medicalHistory: [
      {
        condition: "Migraine",
        diagnosisDate: new Date("2023-03-20"),
        treatment: "Triptans, lifestyle modifications",
        notes: "Frequency reduced with treatment"
      }
    ],
    allergies: [
      { allergen: "Sulfa drugs", severity: "Mild" }
    ],
    medications: [
      {
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed",
        prescribedBy: "Dr. Michael Chen",
        startDate: new Date("2023-03-25")
      }
    ]
  },
  {
    name: "Robert Brown",
    age: 52,
    gender: "Male",
    email: "robert.brown@email.com",
    phone: "555-444-5555",
    address: {
      street: "321 Elm Street",
      city: "New York",
      state: "NY",
      zipCode: "10004"
    },
    medicalCondition: "Arthritis",
    status: "Active",
    emergencyContact: {
      name: "Susan Brown",
      relationship: "Wife",
      phone: "555-444-5556"
    },
    medicalHistory: [
      {
        condition: "Osteoarthritis",
        diagnosisDate: new Date("2022-09-12"),
        treatment: "NSAIDs, physical therapy",
        notes: "Managing pain with current treatment"
      }
    ],
    allergies: [
      { allergen: "Ibuprofen", severity: "Moderate" }
    ],
    medications: [
      {
        name: "Acetaminophen",
        dosage: "650mg",
        frequency: "Three times daily",
        prescribedBy: "Dr. Sarah Johnson",
        startDate: new Date("2022-09-15")
      }
    ]
  },
  {
    name: "Jennifer Lee",
    age: 38,
    gender: "Female",
    email: "jennifer.lee@email.com",
    phone: "555-555-6666",
    address: {
      street: "654 Maple Drive",
      city: "New York",
      state: "NY",
      zipCode: "10005"
    },
    medicalCondition: "Asthma",
    status: "Active",
    emergencyContact: {
      name: "David Lee",
      relationship: "Husband",
      phone: "555-555-6667"
    },
    medicalHistory: [
      {
        condition: "Asthma",
        diagnosisDate: new Date("2021-04-08"),
        treatment: "Inhalers, avoiding triggers",
        notes: "Well controlled with preventer inhaler"
      }
    ],
    allergies: [
      { allergen: "Dust mites", severity: "Moderate" },
      { allergen: "Pollen", severity: "Mild" }
    ],
    medications: [
      {
        name: "Albuterol",
        dosage: "90mcg",
        frequency: "As needed",
        prescribedBy: "Dr. Lisa Anderson",
        startDate: new Date("2021-04-10")
      },
      {
        name: "Fluticasone",
        dosage: "110mcg",
        frequency: "Twice daily",
        prescribedBy: "Dr. Lisa Anderson",
        startDate: new Date("2021-04-10")
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if data already exists
    const userCount = await User.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    const patientCount = await Patient.countDocuments();

    if (userCount > 0 || doctorCount > 0 || patientCount > 0) {
      console.log('📊 Database already contains data. Skipping seed.');
      console.log(`Users: ${userCount}, Doctors: ${doctorCount}, Patients: ${patientCount}`);
      return;
    }

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(seedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create doctors
    console.log('👨‍⚕️ Creating doctors...');
    const createdDoctors = await Doctor.insertMany(seedDoctors);
    console.log(`✅ Created ${createdDoctors.length} doctors`);

    // Get doctor IDs for patient assignment
    const doctorIds = createdDoctors.map(doctor => doctor._id);

    // Create patients with assigned doctors
    console.log('🏥 Creating patients...');
    const patientsWithDoctors = seedPatients.map((patient, index) => ({
      ...patient,
      assignedDoctor: doctorIds[index % doctorIds.length]
    }));
    
    const createdPatients = await Patient.insertMany(patientsWithDoctors);
    console.log(`✅ Created ${createdPatients.length} patients`);

    // Create some sample appointments
    console.log('📅 Creating appointments...');
    const sampleAppointments = [
      {
        patient: createdPatients[0]._id,
        doctor: createdDoctors[0]._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: "09:30",
        type: "Consultation",
        status: "Scheduled",
        reason: "Regular Checkup",
        notes: "Annual physical examination"
      },
      {
        patient: createdPatients[1]._id,
        doctor: createdDoctors[1]._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        time: "14:00",
        type: "Follow-up",
        status: "Scheduled",
        reason: "Diabetes Management",
        notes: "Review blood sugar levels"
      },
      {
        patient: createdPatients[2]._id,
        doctor: createdDoctors[2]._id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: "11:00",
        type: "Consultation",
        status: "Scheduled",
        reason: "Migraine Treatment",
        notes: "Discuss new treatment options"
      }
    ];

    const createdAppointments = await Appointment.insertMany(sampleAppointments);
    console.log(`✅ Created ${createdAppointments.length} appointments`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Doctors: ${createdDoctors.length}`);
    console.log(`- Patients: ${createdPatients.length}`);
    console.log(`- Appointments: ${createdAppointments.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@healthcare.com / admin123');
    console.log('Doctor: sarah.johnson@healthcare.com / doctor123');
    console.log('Nurse: emily.davis@healthcare.com / nurse123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

module.exports = { seedDatabase };
