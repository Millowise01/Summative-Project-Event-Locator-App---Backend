# Event Locator Backend - API Documentation

## Overview
Multi-user event locator application backend built with Node.js, Express, and PostgreSQL with PostGIS for geospatial queries.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Events API](#events-api)
4. [Users API](#users-api)
5. [Reviews API](#reviews-api)
6. [Notifications API](#notifications-api)
7. [Categories API](#categories-api)

## Getting Started

### Prerequisites
- Node.js >= 16
- PostgreSQL >= 12 with PostGIS extension
- Redis (for notifications)

### Installation

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

```bash
# Development
npm run dev

# Production
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Authentication

### Register User
**POST** `/api/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "User registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "preferred_language": "en"
    },
    "token": "jwt_token"
  }
}
```

### Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response: Same as register response with token

### Get Current User
**GET** `/api/auth/me`

Headers: `Authorization: Bearer {token}`

### Update Profile
**PUT** `/api/auth/profile`

Request:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "preferredLanguage": "es"
}
```

### Update Location
**PUT** `/api/auth/location`

Request:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Change Password
**POST** `/api/auth/change-password`

Request:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## Events API

### Create Event
**POST** `/api/events`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main Street",
  "city": "New York",
  "country": "USA",
  "startDate": "2024-06-01T10:00:00Z",
  "endDate": "2024-06-02T18:00:00Z",
  "maxAttendees": 500,
  "categoryIds": ["cat-uuid-1", "cat-uuid-2"]
}
```

### Get Event
**GET** `/api/events/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": "event-uuid",
    "title": "Tech Conference",
    "description": "...",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "start_date": "2024-06-01T10:00:00Z",
    "end_date": "2024-06-02T18:00:00Z",
    "max_attendees": 500,
    "current_attendees": 150,
    "categories": [...],
    "averageRating": "4.50",
    "reviewCount": 20
  }
}
```

### Search Events by Location
**POST** `/api/events/search/location`

Request:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radiusKm": 50,
  "categoryIds": ["cat-uuid"],
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-30T23:59:59Z"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "count": 15,
    "events": [
      {
        "id": "...",
        "title": "...",
        "distance_km": 2.5,
        "...": "..."
      }
    ]
  }
}
```

### Search Events by Text
**GET** `/api/events/search?q=conference&categoryIds=cat-uuid`

### Update Event
**PUT** `/api/events/:id`

Headers: `Authorization: Bearer {token}`

Only event creator can update.

### Delete Event
**DELETE** `/api/events/:id`

Headers: `Authorization: Bearer {token}`

### Get User's Events
**GET** `/api/events`

Headers: `Authorization: Bearer {token}`

## Users API

### Get User Preferences
**GET** `/api/users/preferences`

Headers: `Authorization: Bearer {token}`

### Update Preferences
**PUT** `/api/users/preferences`

Request:
```json
{
  "searchRadiusKm": 75,
  "notificationEnabled": true,
  "newslettersEnabled": false
}
```

### Add Favorite Event
**POST** `/api/users/favorites/:eventId`

Headers: `Authorization: Bearer {token}`

### Remove Favorite Event
**DELETE** `/api/users/favorites/:eventId`

### Get Favorite Events
**GET** `/api/users/favorites`

### Check if Event is Favorite
**GET** `/api/users/favorites/:eventId/check`

### Set Preferred Categories
**POST** `/api/users/categories`

Request:
```json
{
  "categoryIds": ["cat-uuid-1", "cat-uuid-2"]
}
```

### Register for Event
**POST** `/api/users/events/:eventId/register`

### Unregister from Event
**DELETE** `/api/users/events/:eventId/unregister`

### Get Attending Events
**GET** `/api/users/events/attending`

## Reviews API

### Create/Update Review
**POST** `/api/reviews/:eventId`

Request:
```json
{
  "rating": 5,
  "reviewText": "Excellent event!"
}
```

### Get Event Reviews
**GET** `/api/reviews/:eventId?limit=10&offset=0`

### Get Review Statistics
**GET** `/api/reviews/:eventId/stats`

Response:
```json
{
  "success": true,
  "data": {
    "totalReviews": 25,
    "averageRating": "4.50",
    "distribution": {
      "fiveStar": 15,
      "fourStar": 7,
      "threeStar": 2,
      "twoStar": 1,
      "oneStar": 0
    }
  }
}
```

### Get User's Review
**GET** `/api/reviews/:eventId/user`

### Delete Review
**DELETE** `/api/reviews/:reviewId`

### Get Top-Rated Events
**GET** `/api/reviews/top-rated?limit=10`

## Notifications API

### Get Notifications
**GET** `/api/notifications?unreadOnly=false&limit=50`

### Get Unread Count
**GET** `/api/notifications/unread-count`

### Mark as Read
**PUT** `/api/notifications/:notificationId/read`

### Mark All as Read
**PUT** `/api/notifications/mark-all-read`

## Categories API

### Get All Categories
**GET** `/api/categories`

Response:
```json
{
  "success": true,
  "data": {
    "count": 10,
    "categories": [
      {
        "id": "cat-uuid",
        "name": "technology",
        "description": "Tech events and conferences"
      }
    ]
  }
}
```

### Get Category
**GET** `/api/categories/:id`

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "..." // Only in development
}
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Pagination

For endpoints that support pagination:
- `limit`: Number of results (default: 10, max: 100)
- `offset`: Number of results to skip (default: 0)

## Internationalization

The API supports multiple languages via the `Accept-Language` header:

```
Accept-Language: es
```

Supported languages: `en`, `es`, `fr`, `de`

## Rate Limiting

Consider implementing rate limiting based on:
- IP address
- User ID
- API endpoint

## Security Best Practices

1. Always use HTTPS in production
2. Store sensitive data in environment variables
3. Implement rate limiting
4. Use strong JWT secrets
5. Validate all input
6. Implement CORS properly
7. Use helmet.js for security headers
8. Regular security audits

## Performance Optimization

1. Database indexing on frequently queried columns
2. PostGIS indexes for geospatial queries
3. Redis caching for frequently accessed data
4. Pagination for large result sets
5. Connection pooling

## Testing

Run tests with:
```bash
npm test
```

Test coverage reports:
```bash
npm test -- --coverage
```

Target test coverage: 80%+
