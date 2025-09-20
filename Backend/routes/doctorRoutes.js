const express = require('express');
const { body } = require('express-validator');
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorRating,
  getDoctorStats
} = require('../controllers/doctorController');

const router = express.Router();

// Validation middleware
const createDoctorValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('specialty').isIn([
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
    'Dermatology', 'Internal Medicine', 'Emergency Medicine',
    'Radiology', 'Anesthesiology', 'Psychiatry', 'Oncology',
    'Gynecology', 'Urology', 'Ophthalmology', 'ENT'
  ]).withMessage('Invalid specialty'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('consultationFee').isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('department').notEmpty().withMessage('Department is required'),
  body('education').isArray().withMessage('Education must be an array'),
  body('education.*.degree').notEmpty().withMessage('Degree is required'),
  body('education.*.institution').notEmpty().withMessage('Institution is required'),
  body('education.*.year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Valid year is required')
];

const updateDoctorValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('specialty').optional().isIn([
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
    'Dermatology', 'Internal Medicine', 'Emergency Medicine',
    'Radiology', 'Anesthesiology', 'Psychiatry', 'Oncology',
    'Gynecology', 'Urology', 'Ophthalmology', 'ENT'
  ]).withMessage('Invalid specialty'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('status').optional().isIn(['Active', 'On Leave', 'Unavailable']).withMessage('Invalid status')
];

const ratingValidation = [
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

// Routes
router.get('/', getAllDoctors);
router.get('/stats', getDoctorStats);
router.get('/:id', getDoctorById);
router.post('/', createDoctorValidation, createDoctor);
router.put('/:id', updateDoctorValidation, updateDoctor);
router.put('/:id/rating', ratingValidation, updateDoctorRating);
router.delete('/:id', deleteDoctor);

module.exports = router;
