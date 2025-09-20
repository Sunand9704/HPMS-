const mongoose = require('mongoose');

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
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Assigned doctor is required']
  },
  medicalCondition: {
    type: String,
    required: [true, 'Medical condition is required'],
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
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true }
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
