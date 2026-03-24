/**
 * Database Migration Script
 * Creates tables and initializes the database
 */

const db = require('../config/db');
const { createTables, dropTables } = require('./schema');
const { seedDatabase } = require('./seeds');
const logger = require('../config/logger');

async function migrate() {
  try {
    logger.info('Starting database migration...');

    // Drop existing tables (if needed for fresh start)
    // await dropTables();

    // Create tables
    await createTables();

    // Seed initial data
    await seedDatabase();

    logger.info('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
