const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Minimum duration is 15 minutes'],
    max: [480, 'Maximum duration is 8 hours']
  },
  type: {
    type: String,
    required: [true, 'Appointment type is required'],
    enum: ['Consultation', 'Follow-up', 'Emergency', 'Surgery Prep', 'Check-up', 'Procedure']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show', 'Rescheduled'],
    default: 'Scheduled'
  },
  reason: {
    type: String,
    required: [true, 'Appointment reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    oxygenSaturation: Number
  },
  diagnosis: {
    type: String,
    trim: true
  },
  prescription: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledBy: {
    type: String,
    enum: ['Patient', 'Doctor', 'Admin', 'System']
  },
  cancellationDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ type: 1 });

// Virtual for appointment datetime
appointmentSchema.virtual('appointmentDateTime').get(function() {
  const date = new Date(this.appointmentDate);
  const [hours, minutes] = this.appointmentTime.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
});

// Virtual for end time
appointmentSchema.virtual('endTime').get(function() {
  const startTime = new Date(this.appointmentDateTime);
  const endTime = new Date(startTime.getTime() + (this.duration * 60000));
  return endTime.toTimeString().slice(0, 5);
});

// Pre-save middleware to validate appointment time
appointmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('appointmentDate') || this.isModified('appointmentTime')) {
    // Check for conflicts with other appointments
    const conflict = await this.constructor.findOne({
      doctor: this.doctor,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.appointmentTime,
      status: { $in: ['Scheduled', 'In Progress'] },
      _id: { $ne: this._id }
    });

    if (conflict) {
      const error = new Error('Appointment time conflict: Another appointment exists at this time');
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
});

// Instance method to get appointment summary
appointmentSchema.methods.getSummary = function() {
  return {
    id: this._id,
    patient: this.patient,
    doctor: this.doctor,
    appointmentDate: this.appointmentDate,
    appointmentTime: this.appointmentTime,
    type: this.type,
    status: this.status,
    reason: this.reason
  };
};

// Static method to get appointments by date range
appointmentSchema.statics.getByDateRange = function(startDate, endDate, doctorId = null) {
  const query = {
    appointmentDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };
  
  if (doctorId) {
    query.doctor = doctorId;
  }
  
  return this.find(query).populate('patient doctor', 'name email phone specialty');
};

// Static method to get today's appointments
appointmentSchema.statics.getTodaysAppointments = function(doctorId = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const query = {
    appointmentDate: {
      $gte: today,
      $lt: tomorrow
    }
  };
  
  if (doctorId) {
    query.doctor = doctorId;
  }
  
  return this.find(query).populate('patient doctor', 'name email phone specialty');
};

module.exports = mongoose.model('Appointment', appointmentSchema);
