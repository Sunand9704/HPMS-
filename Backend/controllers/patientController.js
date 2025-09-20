const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getAllPatients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      doctor = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { medicalCondition: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (doctor) {
      query.assignedDoctor = doctor;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const patients = await Patient.find(query)
      .populate('assignedDoctor', 'name specialty email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Patient.countDocuments(query);

    // Get statistics
    const stats = await Patient.aggregate([
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
        patients,
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
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message
    });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctor', 'name specialty email phone experience rating')
      .populate('medicalHistory.condition')
      .populate('medications.prescribedBy');

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient',
      error: error.message
    });
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
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
      name,
      age,
      gender,
      email,
      phone,
      address,
      assignedDoctor,
      medicalCondition,
      emergencyContact,
      allergies = [],
      insuranceInfo
    } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this email already exists'
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(assignedDoctor);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: 'Assigned doctor not found'
      });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      email,
      phone,
      address,
      assignedDoctor,
      medicalCondition,
      emergencyContact,
      allergies,
      insuranceInfo
    });

    await patient.save();
    await patient.populate('assignedDoctor', 'name specialty email phone');

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'create_patient',
      entity: 'patient',
      entityId: patient._id,
      description: `Created new patient: ${patient.name}`,
      details: { patientId: patient._id, patientName: patient.name }
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message
    });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedDoctor', 'name specialty email phone');

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'update_patient',
      entity: 'patient',
      entityId: patient._id,
      description: `Updated patient: ${patient.name}`,
      details: { patientId: patient._id, changes: updateData }
    });

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient',
      error: error.message
    });
  }
};

// @desc    Delete patient (soft delete)
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Soft delete
    patient.isActive = false;
    await patient.save();

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'delete_patient',
      entity: 'patient',
      entityId: patient._id,
      description: `Deleted patient: ${patient.name}`,
      details: { patientId: patient._id, patientName: patient.name }
    });

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient',
      error: error.message
    });
  }
};

// @desc    Get patient statistics
// @route   GET /api/patients/stats
// @access  Private
const getPatientStats = async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$status', 'Critical'] }, 1, 0] }
          },
          followUp: {
            $sum: { $cond: [{ $eq: ['$status', 'Follow-up'] }, 1, 0] }
          },
          inactive: {
            $sum: { $cond: [{ $eq: ['$status', 'Inactive'] }, 1, 0] }
          }
        }
      }
    ]);

    const genderStats = await Patient.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    const ageGroups = await Patient.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$age', 18] }, then: '0-17' },
                { case: { $lt: ['$age', 30] }, then: '18-29' },
                { case: { $lt: ['$age', 45] }, then: '30-44' },
                { case: { $lt: ['$age', 60] }, then: '45-59' },
                { case: { $lt: ['$age', 75] }, then: '60-74' }
              ],
              default: '75+'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, active: 0, critical: 0, followUp: 0, inactive: 0 },
        genderDistribution: genderStats,
        ageGroups
      }
    });
  } catch (error) {
    console.error('Get patient stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientStats
};
