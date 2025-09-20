const express = require('express');
const {
  getDashboardOverview,
  getPatientGrowth,
  getAppointmentAnalytics,
  getDoctorPerformance,
  getSystemAlerts,
  getRecentActivities
} = require('../controllers/dashboardController');

const router = express.Router();

// Routes
router.get('/overview', getDashboardOverview);
router.get('/patient-growth', getPatientGrowth);
router.get('/appointment-analytics', getAppointmentAnalytics);
router.get('/doctor-performance', getDoctorPerformance);
router.get('/alerts', getSystemAlerts);
router.get('/activities', getRecentActivities);

module.exports = router;
