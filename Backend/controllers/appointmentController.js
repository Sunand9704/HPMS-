const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAllAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      type = '',
      doctor = '',
      patient = '',
      date = '',
      sortBy = 'appointmentDate',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { reason: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (doctor) {
      query.doctor = doctor;
    }
    
    if (patient) {
      query.patient = patient;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const appointments = await Appointment.find(query)
      .populate('patient', 'name age gender phone email')
      .populate('doctor', 'name specialty email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    // Get statistics
    const stats = await Appointment.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        },
        stats: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name age gender phone email medicalCondition')
      .populate('doctor', 'name specialty email phone experience')
      .populate('createdBy', 'name email role');

    if (!appointment || !appointment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
      duration,
      type,
      reason,
      notes,
      symptoms
    } = req.body;

    // Verify patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists || !patientExists.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Verify doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists || !doctorExists.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check for time conflicts
    const conflict = await Appointment.findOne({
      doctor,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['Scheduled', 'In Progress'] },
      isActive: true
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Appointment time conflict: Doctor has another appointment at this time'
      });
    }

    const appointment = new Appointment({
      patient,
      doctor,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      duration,
      type,
      reason,
      notes,
      symptoms,
      createdBy: req.user.id
    });

    await appointment.save();
    await appointment.populate('patient doctor', 'name email phone specialty');

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'create_appointment',
      entity: 'appointment',
      entityId: appointment._id,
      description: `Created new appointment for ${patientExists.name}`,
      details: { 
        appointmentId: appointment._id, 
        patientName: patientExists.name,
        doctorName: doctorExists.name,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime
      }
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || !appointment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('patient doctor', 'name email phone specialty');

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'update_appointment',
      entity: 'appointment',
      entityId: appointment._id,
      description: `Updated appointment`,
      details: { appointmentId: appointment._id, changes: updateData }
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || !appointment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    appointment.status = 'Cancelled';
    appointment.cancellationReason = cancellationReason;
    appointment.cancelledBy = req.user.role;
    appointment.cancellationDate = new Date();

    await appointment.save();

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'cancel_appointment',
      entity: 'appointment',
      entityId: appointment._id,
      description: `Cancelled appointment`,
      details: { 
        appointmentId: appointment._id, 
        cancellationReason,
        cancelledBy: req.user.role
      }
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

// @desc    Complete appointment
// @route   PUT /api/appointments/:id/complete
// @access  Private
const completeAppointment = async (req, res) => {
  try {
    const { diagnosis, prescription, vitalSigns, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || !appointment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already completed'
      });
    }

    appointment.status = 'Completed';
    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription;
    appointment.vitalSigns = vitalSigns;
    appointment.notes = notes;
    appointment.completedAt = new Date();

    await appointment.save();

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'complete_appointment',
      entity: 'appointment',
      entityId: appointment._id,
      description: `Completed appointment`,
      details: { 
        appointmentId: appointment._id,
        diagnosis,
        prescription: prescription?.length || 0
      }
    });

    res.json({
      success: true,
      message: 'Appointment completed successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete appointment',
      error: error.message
    });
  }
};

// @desc    Get today's appointments
// @route   GET /api/appointments/today
// @access  Private
const getTodaysAppointments = async (req, res) => {
  try {
    const { doctor } = req.query;

    const appointments = await Appointment.getTodaysAppointments(doctor);

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get today\'s appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s appointments',
      error: error.message
    });
  }
};

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private
const getAppointmentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Appointment.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          scheduled: {
            $sum: { $cond: [{ $eq: ['$status', 'Scheduled'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
          },
          noShow: {
            $sum: { $cond: [{ $eq: ['$status', 'No Show'] }, 1, 0] }
          }
        }
      }
    ]);

    const typeStats = await Appointment.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { 
          total: 0, 
          scheduled: 0, 
          inProgress: 0, 
          completed: 0, 
          cancelled: 0, 
          noShow: 0 
        },
        types: typeStats
      }
    });
  } catch (error) {
    console.error('Get appointment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
  getTodaysAppointments,
  getAppointmentStats
};
