const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
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
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    enum: [
      'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
      'Dermatology', 'Internal Medicine', 'Emergency Medicine',
      'Radiology', 'Anesthesiology', 'Psychiatry', 'Oncology',
      'Gynecology', 'Urology', 'Ophthalmology', 'ENT'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true }
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Unavailable'],
    default: 'Active'
  },
  workingHours: {
    monday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    thursday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    friday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    saturday: { start: String, end: String, isWorking: { type: Boolean, default: false } },
    sunday: { start: String, end: String, isWorking: { type: Boolean, default: false } }
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Fee cannot be negative']
  },
  nextAvailable: {
    type: Date,
    default: Date.now
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  languages: [{
    type: String,
    enum: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
doctorSchema.index({ name: 'text', specialty: 'text', email: 'text' });
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ status: 1 });
doctorSchema.index({ department: 1 });

// Virtual for average rating
doctorSchema.virtual('averageRating').get(function() {
  return this.totalRatings > 0 ? (this.rating / this.totalRatings).toFixed(1) : 0;
});

// Virtual for patient count
doctorSchema.virtual('patientCount').get(function() {
  return this.patients ? this.patients.length : 0;
});

// Instance method to get doctor summary
doctorSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    specialty: this.specialty,
    experience: this.experience,
    rating: this.averageRating,
    status: this.status,
    nextAvailable: this.nextAvailable
  };
};

// Instance method to update rating
doctorSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating * this.totalRatings) + newRating;
  this.totalRatings += 1;
  this.rating = totalRating / this.totalRatings;
  return this.save();
};

module.exports = mongoose.model('Doctor', doctorSchema);
