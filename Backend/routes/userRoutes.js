const express = require('express');
const { body } = require('express-validator');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  changeUserPassword,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const createUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['Admin', 'Doctor', 'Nurse', 'Technician', 'Receptionist', 'Manager']).withMessage('Invalid role'),
  body('department').isIn([
    'Administration', 'Cardiology', 'Neurology', 'Pediatrics', 
    'Orthopedics', 'Dermatology', 'Emergency', 'Laboratory',
    'Radiology', 'Pharmacy', 'Nursing', 'Reception'
  ]).withMessage('Invalid department'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required')
];

const updateUserValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['Admin', 'Doctor', 'Nurse', 'Technician', 'Receptionist', 'Manager']).withMessage('Invalid role'),
  body('department').optional().isIn([
    'Administration', 'Cardiology', 'Neurology', 'Pediatrics', 
    'Orthopedics', 'Dermatology', 'Emergency', 'Laboratory',
    'Radiology', 'Pharmacy', 'Nursing', 'Reception'
  ]).withMessage('Invalid department'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('status').optional().isIn(['Active', 'Inactive', 'Suspended']).withMessage('Invalid status')
];

const statusValidation = [
  body('status').isIn(['Active', 'Inactive', 'Suspended']).withMessage('Invalid status')
];

const passwordValidation = [
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Routes
router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.post('/', createUserValidation, createUser);
router.put('/:id', updateUserValidation, updateUser);
router.put('/:id/status', statusValidation, updateUserStatus);
router.put('/:id/password', passwordValidation, changeUserPassword);
router.delete('/:id', deleteUser);

module.exports = router;
