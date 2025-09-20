const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Patient age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
    country: { type: String, default: 'USA' }
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: false
  },
  medicalCondition: {
    type: String,
    required: false,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Follow-up', 'Critical', 'Inactive'],
    default: 'Active'
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  emergencyContact: {
    name: { type: String, required: false },
    relationship: { type: String, required: false },
    phone: { type: String, required: false }
  },
  medicalHistory: [{
    condition: String,
    diagnosisDate: Date,
    treatment: String,
    notes: String
  }],
  allergies: [{
    allergen: String,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe']
    }
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    prescribedBy: String,
    startDate: Date,
    endDate: Date
  }],
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    validUntil: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes for better query performance
patientSchema.index({ name: 'text', email: 'text', medicalCondition: 'text' });
patientSchema.index({ assignedDoctor: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ lastVisit: -1 });

// Virtual for full address
patientSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Instance method to get patient summary
patientSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    age: this.age,
    gender: this.gender,
    status: this.status,
    medicalCondition: this.medicalCondition,
    lastVisit: this.lastVisit
  };
};

module.exports = mongoose.model('Patient', patientSchema);
