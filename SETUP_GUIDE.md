# Event Locator Backend - Complete Setup

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update database credentials and other settings

3. **Database Setup**
   ```bash
   npm run migrate
   npm run seed
   ```

4. **Run Application**
   ```bash
   npm start       # Production
   npm run dev     # Development with auto-reload
   ```

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── db.js           # Database connection
│   ├── i18n.js         # Internationalization
│   └── logger.js       # Logging
├── database/           # Database setup
│   ├── connection.js   # Connection initialization
│   ├── schema.js       # Table definitions
│   ├── seeds.js        # Initial data
│   └── migrate.js      # Migration script
├── middleware/         # Express middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── routes/            # API routes
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── userRoutes.js
│   ├── reviewRoutes.js
│   ├── notificationRoutes.js
│   └── categoryRoutes.js
├── services/          # Business logic
│   ├── authService.js
│   ├── eventService.js
│   ├── userService.js
│   ├── reviewService.js
│   └── notificationService.js
├── tests/            # Test suites
│   ├── services/
│   └── integration/
└── index.js          # Application entry point
```

## Key Features Implemented

### 1. User Management
- Secure registration with password hashing (bcryptjs)
- JWT-based authentication
- User profile management
- Location tracking (PostGIS)
- Multi-language support

### 2. Event Management
- Create, read, update, delete events
- Geospatial data storage (PostGIS)
- Event categorization
- Capacity management
- Event attendance tracking

### 3. Location-Based Search
- Find events within a specified radius
- Uses PostGIS spatial queries for efficient searching
- Supports category filtering
- Date range filtering

### 4. Category System
- Predefined event categories
- User favorite categories
- Category-based notifications

### 5. Review System
- Event ratings (1-5 stars)
- User reviews with comments
- Average rating calculations
- Review history tracking

### 6. Notification System
- Redis Pub/Sub for real-time notifications
- Event reminders
- Category-based notifications
- Notification preferences per user
- Mark as read functionality

### 7. Internationalization (i18n)
- Support for: English, Spanish, French, German
- Language-specific error messages
- Dynamic language switching per user
- Translation keys for all messages

## API Endpoints

### Authentication: `/api/auth`
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update profile
- `PUT /location` - Update user location
- `POST /change-password` - Change password

### Events: `/api/events`
- `POST /` - Create event (requires auth)
- `GET /:id` - Get event details
- `GET /` - Get all public events
- `POST /search/location` - Search by location & radius
- `GET /category/:categoryId` - Search by category
- `PUT /:id` - Update event (requires auth)
- `DELETE /:id` - Delete event (requires auth)
- `POST /:id/join` - Join event (requires auth)
- `POST /:id/leave` - Leave event (requires auth)
- `GET /:id/attendees` - Get attendees list

### Users: `/api/users` (requires auth)
- `GET /me` - Get current user
- `GET /preferences` - Get user preferences
-`PUT /preferences` - Update preferences
- `POST /categories/:categoryId` - Add favorite category
- `DELETE /categories/:categoryId` - Remove favorite category
- `GET /categories/favorites` - Get favorite categories
- `POST /events/:eventId/favorite` - Add favorite event
- `DELETE /events/:eventId/favorite` - Remove favorite event
- `GET /events/favorites` - Get favorite events
- `GET /events/organized` - Get organized events
- `GET /events/attending` - Get attending events

### Reviews: `/api/reviews`
- `POST /` - Create review (requires auth)
- `GET /:id` - Get review
- `GET /events/:eventId` - Get event reviews
- `GET /users/:userId` - Get user reviews
- `GET /events/:eventId/rating` - Get average rating
- `PUT /:id` - Update review (requires auth)
- `DELETE /:id` - Delete review (requires auth)

### Notifications: `/api/notifications` (requires auth)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark as read
- `PUT /mark-all-read` - Mark all as read
- `DELETE /:id` - Delete notification

### Categories: `/api/categories`
- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `POST /` - Create category

## Testing

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
```

Test coverage includes:
- Authentication (registration, login, tokens)
- Event operations (CRUD)
- Location-based searching
- Review system
- User preferences
- API integration tests

## Database Schema Highlights

### PostGIS Support
- `location_point` stores coordinates with spatial index
- `ST_DWithin` queries for efficient radius searches
- Supports distance calculations

### Tables
- **users** - User accounts with location
- **user_preferences** - Search radius, notifications
- **events** - Events with geospatial data
- **event_attendees** - Attendance tracking
- **reviews** - Event ratings and comments
- **notifications** - User notifications
- **favorite_events** - User favorites
- **categories** - Event categories

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with PostGIS for geospatial data
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Messaging**: Redis Pub/Sub
- **i18n**: i18next
- **Logging**: Winston
- **Testing**: Jest with Supertest
- **Validation**: express-validator
- **Security**: Helmet, CORS

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication (7-day expiry)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- CORS enabled
- Helmet.js for HTTP headers
- Rate limiting ready

## Performance Optimizations

- PostGIS spatial indexes
- Database query optimization
- Connection pooling (pg-promise)
- Pagination support on all list endpoints
- Efficient distance calculations with PostGIS

## Error Handling

- Centralized error middleware
- Consistent error response format
- Internationalized error messages
- Comprehensive logging
- Stack traces in development mode

## Environment Variables

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_locator_db
DB_USER=postgres
DB_PASSWORD=postgres
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
LOG_LEVEL=info
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,es,fr,de
```

## Next Steps

1. Deploy PostgreSQL with PostGIS
2. Configure Redis for production
3. Set up environment variables
4. Run database migrations
5. Start the application
6. Test API endpoints with provided curl/Postman collection

## Contributing

- Follow the existing code structure
- Write tests for new features
- Update documentation
- Use meaningful commit messages

## License

MIT
