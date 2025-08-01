// Express.js backend server with RESTful API
import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
async function initializeDatabase() {
  try {
    await fs.access(DB_FILE);
  } catch (error) {
    // Database file doesn't exist, create it with initial data
    const initialData = {
      products: [
        {
          id: 1,
          name: "iPhone 15 Pro",
          category: "Electronics",
          price: 999.99,
          quantity: 50,
          status: "Active",
          date: "2024-01-15"
        },
        {
          id: 2,
          name: "MacBook Air M3",
          category: "Electronics",
          price: 1299.99,
          quantity: 25,
          status: "Active",
          date: "2024-01-20"
        },
        {
          id: 3,
          name: "Nike Air Max",
          category: "Clothing",
          price: 159.99,
          quantity: 100,
          status: "Active",
          date: "2024-01-12"
        },
        {
          id: 4,
          name: "The Great Gatsby",
          category: "Books",
          price: 12.99,
          quantity: 200,
          status: "Active",
          date: "2024-01-08"
        },
        {
          id: 5,
          name: "Coffee Maker",
          category: "Home",
          price: 89.99,
          quantity: 30,
          status: "Active",
          date: "2024-01-22"
        },
        {
          id: 6,
          name: "Samsung Galaxy S24",
          category: "Electronics",
          price: 799.99,
          quantity: 75,
          status: "Active",
          date: "2024-01-18"
        },
        {
          id: 7,
          name: "Adidas T-Shirt",
          category: "Clothing",
          price: 29.99,
          quantity: 150,
          status: "Active",
          date: "2024-01-14"
        },
        {
          id: 8,
          name: "JavaScript Guide",
          category: "Books",
          price: 45.99,
          quantity: 80,
          status: "Active",
          date: "2024-01-10"
        },
        {
          id: 9,
          name: "Vacuum Cleaner",
          category: "Home",
          price: 199.99,
          quantity: 20,
          status: "Inactive",
          date: "2024-01-05"
        },
        {
          id: 10,
          name: "Tennis Racket",
          category: "Sports",
          price: 129.99,
          quantity: 40,
          status: "Active",
          date: "2024-01-25"
        }
      ],
      nextId: 11
    };
    
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('Database initialized with sample data');
  }
}

// Database helper functions
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { products: [], nextId: 1 };
  }
}

async function writeDatabase(data) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// API Routes

// GET /api/products - Get all products with optional filtering
app.get('/api/products', async (req, res) => {
  try {
    const db = await readDatabase();
    let products = db.products;
    
    // Apply filters if provided
    const { search, category, status, minPrice, maxPrice, page = 1, limit = 10, sortBy, sortOrder = 'asc' } = req.query;
    
    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      products = products.filter(product => 
        Object.values(product).some(value => 
          value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }
    
    // Category filter
    if (category) {
      products = products.filter(product => product.category === category);
    }
    
    // Status filter
    if (status) {
      products = products.filter(product => product.status === status);
    }
    
    // Price range filter
    if (minPrice) {
      products = products.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(product => product.price <= parseFloat(maxPrice));
    }
    
    // Sorting
    if (sortBy) {
      products.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        // Handle different data types
        if (sortBy === 'price' || sortBy === 'quantity' || sortBy === 'id') {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        } else if (sortBy === 'date') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        } else {
          aVal = aVal.toString().toLowerCase();
          bVal = bVal.toString().toLowerCase();
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Pagination
    const totalProducts = products.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    // Calculate aggregations
    const prices = products.map(p => p.price);
    const aggregations = {
      totalRecords: totalProducts,
      avgPrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      maxPrice: prices.length > 0 ? Math.max(...prices) : 0
    };
    
    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalProducts / limitNum),
        totalItems: totalProducts,
        limit: limitNum
      },
      aggregations
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/products/:id - Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const db = await readDatabase();
    const product = db.products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/products - Create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, quantity, status } = req.body;
    
    // Validation
    if (!name || !category || price === undefined || quantity === undefined || !status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: name, category, price, quantity, status' 
      });
    }
    
    const db = await readDatabase();
    const newProduct = {
      id: db.nextId,
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      status,
      date: new Date().toISOString().split('T')[0]
    };
    
    db.products.push(newProduct);
    db.nextId++;
    
    const success = await writeDatabase(db);
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to save product' });
    }
    
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, category, price, quantity, status } = req.body;
    
    const db = await readDatabase();
    const productIndex = db.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Update product
    const updatedProduct = {
      ...db.products[productIndex],
      ...(name && { name }),
      ...(category && { category }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(quantity !== undefined && { quantity: parseInt(quantity) }),
      ...(status && { status })
    };
    
    db.products[productIndex] = updatedProduct;
    
    const success = await writeDatabase(db);
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to update product' });
    }
    
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const db = await readDatabase();
    const productIndex = db.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const deletedProduct = db.products.splice(productIndex, 1)[0];
    
    const success = await writeDatabase(db);
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
    
    res.json({ success: true, data: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/stats - Get database statistics
app.get('/api/stats', async (req, res) => {
  try {
    const db = await readDatabase();
    const products = db.products;
    
    const categories = [...new Set(products.map(p => p.category))];
    const statuses = [...new Set(products.map(p => p.status))];
    
    const categoryStats = categories.map(category => ({
      category,
      count: products.filter(p => p.category === category).length,
      totalValue: products
        .filter(p => p.category === category)
        .reduce((sum, p) => sum + (p.price * p.quantity), 0)
    }));
    
    const statusStats = statuses.map(status => ({
      status,
      count: products.filter(p => p.status === status).length
    }));
    
    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        categories: categoryStats,
        statuses: statusStats,
        priceRange: {
          min: Math.min(...products.map(p => p.price)),
          max: Math.max(...products.map(p => p.price))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
    console.log(`💾 Database file: ${DB_FILE}`);
  });
}

startServer().catch(console.error);
