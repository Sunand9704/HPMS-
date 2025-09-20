const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
const getDashboardOverview = async (req, res) => {
  try {
    // Get total counts
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalUsers,
      todayAppointments,
      recentActivities
    ] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      Doctor.countDocuments({ isActive: true }),
      Appointment.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Appointment.getTodaysAppointments(),
      Activity.getRecent(10)
    ]);

    // Get patient status breakdown
    const patientStats = await Patient.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get appointment status breakdown
    const appointmentStats = await Appointment.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get doctor status breakdown
    const doctorStats = await Doctor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user role breakdown
    const userRoleStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          totalUsers,
          todayAppointments: todayAppointments.length
        },
        patientStats: patientStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        appointmentStats: appointmentStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        doctorStats: doctorStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        userRoleStats: userRoleStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        recentActivities
      }
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard overview',
      error: error.message
    });
  }
};

// @desc    Get patient growth data
// @route   GET /api/dashboard/patient-growth
// @access  Private
const getPatientGrowth = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const growthData = await Patient.aggregate([
      {
        $match: {
          isActive: true,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format data for charts
    const formattedData = growthData.map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      patients: item.count
    }));

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Get patient growth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient growth data',
      error: error.message
    });
  }
};

// @desc    Get appointment analytics
// @route   GET /api/dashboard/appointment-analytics
// @access  Private
const getAppointmentAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get appointment status distribution
    const statusDistribution = await Appointment.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get appointment type distribution
    const typeDistribution = await Appointment.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get daily appointment trends
    const dailyTrends = await Appointment.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusDistribution: statusDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        typeDistribution: typeDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        dailyTrends
      }
    });
  } catch (error) {
    console.error('Get appointment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment analytics',
      error: error.message
    });
  }
};

// @desc    Get doctor performance
// @route   GET /api/dashboard/doctor-performance
// @access  Private
const getDoctorPerformance = async (req, res) => {
  try {
    const performanceData = await Doctor.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: 'assignedDoctor',
          as: 'patients'
        }
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'doctor',
          as: 'appointments'
        }
      },
      {
        $project: {
          name: 1,
          specialty: 1,
          rating: 1,
          experience: 1,
          patientCount: { $size: '$patients' },
          appointmentCount: { $size: '$appointments' },
          completedAppointments: {
            $size: {
              $filter: {
                input: '$appointments',
                cond: { $eq: ['$$this.status', 'Completed'] }
              }
            }
          }
        }
      },
      {
        $sort: { rating: -1 }
      }
    ]);

    res.json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    console.error('Get doctor performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor performance data',
      error: error.message
    });
  }
};

// @desc    Get system alerts
// @route   GET /api/dashboard/alerts
// @access  Private
const getSystemAlerts = async (req, res) => {
  try {
    const alerts = [];

    // Check for critical patients
    const criticalPatients = await Patient.countDocuments({ 
      status: 'Critical', 
      isActive: true 
    });
    if (criticalPatients > 0) {
      alerts.push({
        type: 'critical',
        message: `${criticalPatients} critical patients require attention`,
        count: criticalPatients,
        priority: 'high'
      });
    }

    // Check for overdue appointments
    const overdueAppointments = await Appointment.countDocuments({
      appointmentDate: { $lt: new Date() },
      status: { $in: ['Scheduled', 'In Progress'] },
      isActive: true
    });
    if (overdueAppointments > 0) {
      alerts.push({
        type: 'overdue',
        message: `${overdueAppointments} appointments are overdue`,
        count: overdueAppointments,
        priority: 'medium'
      });
    }

    // Check for inactive users
    const inactiveUsers = await User.countDocuments({
      status: 'Inactive',
      isActive: true
    });
    if (inactiveUsers > 0) {
      alerts.push({
        type: 'inactive_users',
        message: `${inactiveUsers} users are inactive`,
        count: inactiveUsers,
        priority: 'low'
      });
    }

    // Check for doctors on leave
    const doctorsOnLeave = await Doctor.countDocuments({
      status: 'On Leave',
      isActive: true
    });
    if (doctorsOnLeave > 0) {
      alerts.push({
        type: 'doctors_leave',
        message: `${doctorsOnLeave} doctors are on leave`,
        count: doctorsOnLeave,
        priority: 'medium'
      });
    }

    res.json({
      success: true,
      data: {
        alerts,
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(alert => alert.priority === 'high').length
      }
    });
  } catch (error) {
    console.error('Get system alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system alerts',
      error: error.message
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const activities = await Activity.getRecent(parseInt(limit));

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardOverview,
  getPatientGrowth,
  getAppointmentAnalytics,
  getDoctorPerformance,
  getSystemAlerts,
  getRecentActivities
};
