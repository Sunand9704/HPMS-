const express = require('express');
const { body } = require('express-validator');
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientStats
} = require('../controllers/patientController');

const router = express.Router();

// Validation middleware
const createPatientValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('assignedDoctor').isMongoId().withMessage('Valid doctor ID is required'),
  body('medicalCondition').notEmpty().withMessage('Medical condition is required'),
  body('emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContact.relationship').notEmpty().withMessage('Emergency contact relationship is required'),
  body('emergencyContact.phone').isMobilePhone().withMessage('Valid emergency contact phone is required')
];

const updatePatientValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('age').optional().isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('assignedDoctor').optional().isMongoId().withMessage('Valid doctor ID is required'),
  body('status').optional().isIn(['Active', 'Follow-up', 'Critical', 'Inactive']).withMessage('Invalid status')
];

// Routes
router.get('/', getAllPatients);
router.get('/stats', getPatientStats);
router.get('/:id', getPatientById);
router.post('/', createPatientValidation, createPatient);
router.put('/:id', updatePatientValidation, updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;
