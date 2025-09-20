const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Verify JWT token
// @access  Private
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hpms_secret_key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// @desc    Check user role permissions
// @access  Private
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// @desc    Check if user can access resource
// @access  Private
const authorizeResource = (resource) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin has access to everything
    if (req.user.role === 'Admin') {
      return next();
    }

    // Check user permissions
    const hasPermission = req.user.permissions?.some(permission => 
      permission.module === resource && 
      (permission.actions.includes('read') || permission.actions.includes('update'))
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied for ${resource} resource`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeResource
};
