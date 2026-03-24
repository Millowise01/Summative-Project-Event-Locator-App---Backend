const { db, pgp } = require('./connection');

/**
 * Seed default categories into the database
 */

const DEFAULT_CATEGORIES = [
  { name: 'music', description: 'Music concerts and performances' },
  { name: 'sports', description: 'Sports events and competitions' },
  { name: 'art', description: 'Art exhibitions and gallery events' },
  { name: 'technology', description: 'Tech conferences and meetups' },
  { name: 'food', description: 'Food festivals and culinary events' },
  { name: 'business', description: 'Business conferences and networking events' },
  { name: 'education', description: 'Educational workshops and seminars' },
  { name: 'entertainment', description: 'Entertainment and party events' },
  { name: 'health', description: 'Health and wellness events' },
  { name: 'community', description: 'Community and social events' }
];

async function seedCategories() {
  try {
    console.log('Seeding categories...');
    
    for (const category of DEFAULT_CATEGORIES) {
      await db.oneOrNone(
        'INSERT INTO categories (name, description) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
        [category.name, category.description]
      );
    }
    
    console.log('✓ Categories seeded successfully');
    return true;
  } catch (error) {
    console.error('✗ Category seeding failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  seedCategories().finally(() => {
    pgp.end();
  });
}

module.exports = { seedCategories };
