const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

/**
 * Authentication Service
 * Handles user registration, login, and token generation
 */

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User information
   * @returns {Promise<Object>} User object with token
   */
  async registerUser(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await db.oneOrNone(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const userId = uuidv4();
    const user = await db.one(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, preferred_language)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, preferred_language, created_at`,
      [userId, email, passwordHash, firstName, lastName, 'en']
    );

    // Create user preferences
    await db.none(
      'INSERT INTO user_preferences (user_id) VALUES ($1)',
      [userId]
    );

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object with token
   */
  async loginUser(email, password) {
    const user = await db.oneOrNone(
      `SELECT id, email, password_hash, first_name, last_name, preferred_language, is_active
       FROM users WHERE email = $1`,
      [email]
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
      throw new Error('User account is inactive');
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    // Remove password hash from response
    delete user.password_hash;

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  /**
   * Verify and decode JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Decoded token
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT token
   * @param {string} userId - User ID
   * @returns {string} JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(userId) {
    const user = await db.oneOrNone(
      `SELECT id, email, first_name, last_name, phone, location, preferred_language, 
              created_at, is_active FROM users WHERE id = $1`,
      [userId]
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user object
   */
  async updateUserProfile(userId, updates) {
    const allowedFields = ['first_name', 'last_name', 'phone', 'preferred_language'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map((key, index) => `${key} = $${index + 2}`);

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    const values = [userId, ...Object.values(updates).filter((_, key) => allowedFields.includes(Object.keys(updates)[key]))];
    
    const user = await db.one(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING id, email, first_name, last_name, phone, preferred_language, location`,
      values
    );

    return user;
  }

  /**
   * Update user location
   * @param {string} userId - User ID
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<Object>} Updated user object
   */
  async updateUserLocation(userId, latitude, longitude) {
    const user = await db.one(
      `UPDATE users 
       SET location = ST_GeogFromText('POINT($1 $2)'), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, first_name, last_name, location::text`,
      [longitude, latitude, userId]
    );

    return user;
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await db.oneOrNone(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await db.none(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    return true;
  }
}

module.exports = new AuthService();
