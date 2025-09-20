const express = require('express');
const { body } = require('express-validator');
const { createPublicAppointment } = require('../controllers/appointmentController');

const router = express.Router();

// Validation middleware for public appointment booking
const publicAppointmentValidation = [
  body('doctor').isMongoId().withMessage('Valid doctor ID is required'),
  body('patient.name').notEmpty().withMessage('Patient name is required'),
  body('patient.email').isEmail().withMessage('Valid patient email is required'),
  body('patient.phone').notEmpty().withMessage('Patient phone is required'),
  body('date').isISO8601().withMessage('Valid appointment date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
  body('type').optional().isIn(['Consultation', 'Follow-up', 'Emergency', 'Surgery Prep', 'Check-up', 'Procedure']).withMessage('Invalid appointment type'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('bloodPressure').optional().isString().withMessage('Blood pressure must be a string'),
  body('heartRate').optional().isInt({ min: 30, max: 200 }).withMessage('Heart rate must be between 30 and 200 BPM')
];

// Public routes (no authentication required)
router.post('/', publicAppointmentValidation, createPublicAppointment);

module.exports = router;
