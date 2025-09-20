const express = require('express');
const { body } = require('express-validator');
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
  getTodaysAppointments,
  getAppointmentStats
} = require('../controllers/appointmentController');

const router = express.Router();

// Validation middleware
const createAppointmentValidation = [
  body('patient').isMongoId().withMessage('Valid patient ID is required'),
  body('doctor').isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
  body('type').isIn(['Consultation', 'Follow-up', 'Emergency', 'Surgery Prep', 'Check-up', 'Procedure']).withMessage('Invalid appointment type'),
  body('reason').notEmpty().withMessage('Appointment reason is required')
];

const updateAppointmentValidation = [
  body('appointmentDate').optional().isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
  body('duration').optional().isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
  body('type').optional().isIn(['Consultation', 'Follow-up', 'Emergency', 'Surgery Prep', 'Check-up', 'Procedure']).withMessage('Invalid appointment type'),
  body('status').optional().isIn(['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show', 'Rescheduled']).withMessage('Invalid status')
];

const cancelAppointmentValidation = [
  body('cancellationReason').notEmpty().withMessage('Cancellation reason is required')
];

const completeAppointmentValidation = [
  body('diagnosis').optional().isString().withMessage('Diagnosis must be a string'),
  body('prescription').optional().isArray().withMessage('Prescription must be an array'),
  body('vitalSigns').optional().isObject().withMessage('Vital signs must be an object'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

// Routes
router.get('/', getAllAppointments);
router.get('/today', getTodaysAppointments);
router.get('/stats', getAppointmentStats);
router.get('/:id', getAppointmentById);
router.post('/', createAppointmentValidation, createAppointment);
router.put('/:id', updateAppointmentValidation, updateAppointment);
router.put('/:id/cancel', cancelAppointmentValidation, cancelAppointment);
router.put('/:id/complete', completeAppointmentValidation, completeAppointment);

module.exports = router;
