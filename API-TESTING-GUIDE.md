# API Documentation & Testing Guide

This document provides comprehensive information about the Data Table System API endpoints and how to test them.

## 🚀 Getting Started

### Start the Backend Server

```bash
# Option 1: Start backend only
npm run backend

# Option 2: Start both backend and frontend
npm start

# Option 3: Development mode with auto-restart
npm run backend:dev
```

The backend server runs on **http://localhost:3001**

## 📋 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### 1. Health Check
**GET** `/api/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Get All Products
**GET** `/api/products`

Fetch products with optional filtering, sorting, and pagination.

**Query Parameters:**
- `search` - Search across all fields
- `category` - Filter by category
- `status` - Filter by status
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Column to sort by
- `sortOrder` - 'asc' or 'desc' (default: 'asc')

**Example:**
```
GET /api/products?search=iPhone&category=Electronics&page=1&limit=10&sortBy=price&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": [...products],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "limit": 10
  },
  "aggregations": {
    "totalRecords": 50,
    "avgPrice": 299.99,
    "totalValue": 15000.00,
    "maxPrice": 1299.99
  }
}
```

### 3. Get Single Product
**GET** `/api/products/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "category": "Electronics",
    "price": 999.99,
    "quantity": 50,
    "status": "Active",
    "date": "2024-01-15"
  }
}
```

### 4. Create Product
**POST** `/api/products`

**Request Body:**
```json
{
  "name": "New Product",
  "category": "Electronics",
  "price": 299.99,
  "quantity": 100,
  "status": "Active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 26,
    "name": "New Product",
    "category": "Electronics",
    "price": 299.99,
    "quantity": 100,
    "status": "Active",
    "date": "2024-01-15"
  }
}
```

### 5. Update Product
**PUT** `/api/products/:id`

**Request Body:** (partial update supported)
```json
{
  "name": "Updated Product Name",
  "price": 349.99
}
```

### 6. Delete Product
**DELETE** `/api/products/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 26,
    "name": "Deleted Product",
    ...
  }
}
```

### 7. Get Statistics
**GET** `/api/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 25,
    "categories": [
      {
        "category": "Electronics",
        "count": 10,
        "totalValue": 15000.00
      }
    ],
    "statuses": [
      {
        "status": "Active",
        "count": 20
      }
    ],
    "priceRange": {
      "min": 12.99,
      "max": 1299.99
    }
  }
}
```

## 🧪 Testing Methods

### 1. Browser Testing
Open the application and click the **"Test API"** button to run automated tests.

### 2. cURL Testing

#### Health Check
```bash
curl http://localhost:3001/api/health
```

#### Get Products
```bash
curl "http://localhost:3001/api/products?limit=5"
```

#### Create Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "category": "Electronics",
    "price": 199.99,
    "quantity": 50,
    "status": "Active"
  }'
```

#### Update Product
```bash
curl -X PUT http://localhost:3001/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 899.99}'
```

#### Delete Product
```bash
curl -X DELETE http://localhost:3001/api/products/26
```

### 3. Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Data Table API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Get Products",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/products?limit=10&page=1",
          "host": ["{{baseUrl}}"],
          "path": ["products"],
          "query": [
            {"key": "limit", "value": "10"},
            {"key": "page", "value": "1"}
          ]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001/api"
    }
  ]
}
```

### 4. JavaScript Testing

```javascript
// Test all endpoints
async function testAPI() {
  const baseUrl = 'http://localhost:3001/api';
  
  // Health check
  const health = await fetch(`${baseUrl}/health`);
  console.log('Health:', await health.json());
  
  // Get products
  const products = await fetch(`${baseUrl}/products?limit=5`);
  console.log('Products:', await products.json());
  
  // Create product
  const newProduct = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Product',
      category: 'Electronics',
      price: 199.99,
      quantity: 50,
      status: 'Active'
    })
  });
  console.log('Created:', await newProduct.json());
}

testAPI();
```

## 🎯 Playwright Testing Scenarios

Perfect API endpoints for Playwright automation testing:

### 1. **Search & Filter Testing**
```javascript
// Test search functionality
await page.fill('#searchInput', 'iPhone');
await page.waitForResponse('**/api/products?search=iPhone*');

// Test category filter
await page.selectOption('#categoryFilter', 'Electronics');
await page.waitForResponse('**/api/products?category=Electronics*');
```

### 2. **CRUD Operations Testing**
```javascript
// Test create
await page.click('#addRecord');
await page.fill('#recordName', 'Test Product');
await page.click('#saveRecord');
await page.waitForResponse('**/api/products', { status: 201 });

// Test edit
await page.click('.edit-btn[data-id="1"]');
await page.fill('#recordPrice', '899.99');
await page.click('#saveRecord');
await page.waitForResponse('**/api/products/1', { status: 200 });

// Test delete
await page.click('.delete-btn[data-id="26"]');
await page.click('button:has-text("OK")'); // Confirm dialog
await page.waitForResponse('**/api/products/26', { status: 200 });
```

### 3. **Pagination Testing**
```javascript
// Test pagination
await page.click('#nextPage');
await page.waitForResponse('**/api/products?page=2*');

// Test page size change
await page.selectOption('#pageSize', '25');
await page.waitForResponse('**/api/products?limit=25*');
```

### 4. **Sorting Testing**
```javascript
// Test column sorting
await page.click('th[data-column="price"]');
await page.waitForResponse('**/api/products?sortBy=price&sortOrder=asc*');

// Test reverse sorting
await page.click('th[data-column="price"]');
await page.waitForResponse('**/api/products?sortBy=price&sortOrder=desc*');
```

## 📊 Database

The system uses a simple **JSON file database** (`backend/database.json`) that:
- ✅ Persists data between server restarts
- ✅ Supports concurrent read/write operations
- ✅ Easy to backup and restore
- ✅ Human-readable format
- ✅ Perfect for testing and development

## 🔧 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 🚀 Deployment Ready

The API is ready for deployment to:
- **Heroku** - Add `Procfile`
- **Railway** - Zero config deployment
- **DigitalOcean App Platform**
- **AWS Lambda** - With serverless framework
- **Docker** - Containerized deployment

---

**Ready for comprehensive API testing!** 🎯
