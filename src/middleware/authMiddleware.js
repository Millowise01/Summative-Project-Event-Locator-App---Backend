const authService = require('../services/authService');
const logger = require('./logger');

/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user data to requests
 */

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: req.i18n.t('auth.unauthorized')
      });
    }

    const decoded = await authService.verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error('Authentication error:', error.message);
    res.status(401).json({
      success: false,
      message: req.i18n.t('auth.unauthorized'),
      error: error.message
    });
  }
}

module.exports = { authenticateToken };
