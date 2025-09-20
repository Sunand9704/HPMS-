const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private
const getAllDoctors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      specialty = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (specialty) {
      query.specialty = specialty;
    }
    
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const doctors = await Doctor.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Doctor.countDocuments(query);

    // Get statistics
    const stats = await Doctor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const specialtyStats = await Doctor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$specialty',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        },
        stats: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        specialties: specialtyStats
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Private
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get patient count for this doctor
    const patientCount = await Patient.countDocuments({ 
      assignedDoctor: req.params.id, 
      isActive: true 
    });

    res.json({
      success: true,
      data: {
        ...doctor.toObject(),
        patientCount
      }
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
      error: error.message
    });
  }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private
const createDoctor = async (req, res) => {
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
      email,
      phone,
      specialty,
      licenseNumber,
      experience,
      education,
      certifications,
      workingHours,
      consultationFee,
      department,
      bio,
      languages
    } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email or license number already exists'
      });
    }

    const doctor = new Doctor({
      name,
      email,
      phone,
      specialty,
      licenseNumber,
      experience,
      education,
      certifications,
      workingHours,
      consultationFee,
      department,
      bio,
      languages
    });

    await doctor.save();

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'create_doctor',
      entity: 'doctor',
      entityId: doctor._id,
      description: `Created new doctor: ${doctor.name}`,
      details: { doctorId: doctor._id, doctorName: doctor.name, specialty: doctor.specialty }
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor',
      error: error.message
    });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private
const updateDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'update_doctor',
      entity: 'doctor',
      entityId: doctor._id,
      description: `Updated doctor: ${doctor.name}`,
      details: { doctorId: doctor._id, changes: updateData }
    });

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor',
      error: error.message
    });
  }
};

// @desc    Delete doctor (soft delete)
// @route   DELETE /api/doctors/:id
// @access  Private
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor has assigned patients
    const assignedPatients = await Patient.countDocuments({ 
      assignedDoctor: req.params.id, 
      isActive: true 
    });

    if (assignedPatients > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete doctor. ${assignedPatients} patients are assigned to this doctor.`
      });
    }

    // Soft delete
    doctor.isActive = false;
    await doctor.save();

    // Log activity
    await Activity.logActivity({
      user: req.user.id,
      action: 'delete_doctor',
      entity: 'doctor',
      entityId: doctor._id,
      description: `Deleted doctor: ${doctor.name}`,
      details: { doctorId: doctor._id, doctorName: doctor.name }
    });

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete doctor',
      error: error.message
    });
  }
};

// @desc    Update doctor rating
// @route   PUT /api/doctors/:id/rating
// @access  Private
const updateDoctorRating = async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    await doctor.updateRating(rating);

    res.json({
      success: true,
      message: 'Doctor rating updated successfully',
      data: {
        rating: doctor.averageRating,
        totalRatings: doctor.totalRatings
      }
    });
  } catch (error) {
    console.error('Update doctor rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor rating',
      error: error.message
    });
  }
};

// @desc    Get doctor statistics
// @route   GET /api/doctors/stats
// @access  Private
const getDoctorStats = async (req, res) => {
  try {
    const stats = await Doctor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          onLeave: {
            $sum: { $cond: [{ $eq: ['$status', 'On Leave'] }, 1, 0] }
          },
          unavailable: {
            $sum: { $cond: [{ $eq: ['$status', 'Unavailable'] }, 1, 0] }
          },
          avgRating: { $avg: '$rating' },
          avgExperience: { $avg: '$experience' }
        }
      }
    ]);

    const specialtyStats = await Doctor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$specialty',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { 
          total: 0, 
          active: 0, 
          onLeave: 0, 
          unavailable: 0, 
          avgRating: 0, 
          avgExperience: 0 
        },
        specialties: specialtyStats
      }
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorRating,
  getDoctorStats
};
