const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'login', 'logout', 'create_patient', 'update_patient', 'delete_patient',
      'create_doctor', 'update_doctor', 'delete_doctor',
      'create_appointment', 'update_appointment', 'cancel_appointment', 'complete_appointment',
      'create_user', 'update_user', 'delete_user', 'suspend_user',
      'view_dashboard', 'export_data', 'generate_report'
    ]
  },
  entity: {
    type: String,
    enum: ['patient', 'doctor', 'appointment', 'user', 'dashboard', 'system']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['success', 'error', 'warning'],
    default: 'success'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ action: 1 });
activitySchema.index({ entity: 1, entityId: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ createdAt: -1 });

// Instance method to get activity summary
activitySchema.methods.getSummary = function() {
  return {
    id: this._id,
    user: this.user,
    action: this.action,
    entity: this.entity,
    description: this.description,
    status: this.status,
    createdAt: this.createdAt
  };
};

// Static method to get recent activities
activitySchema.statics.getRecent = function(limit = 10) {
  return this.find({ isActive: true })
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get activities by user
activitySchema.statics.getByUser = function(userId, limit = 50) {
  return this.find({ user: userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get activities by entity
activitySchema.statics.getByEntity = function(entity, entityId) {
  return this.find({ entity, entityId, isActive: true })
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });
};

// Static method to log activity
activitySchema.statics.logActivity = function(data) {
  const activity = new this({
    user: data.user,
    action: data.action,
    entity: data.entity,
    entityId: data.entityId,
    description: data.description,
    details: data.details,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    status: data.status || 'success',
    severity: data.severity || 'low'
  });
  
  return activity.save();
};

module.exports = mongoose.model('Activity', activitySchema);
