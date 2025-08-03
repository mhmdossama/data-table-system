// Serverless API entry point for Vercel
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database for serverless deployment
let database = {
  products: [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      category: "Electronics",
      price: 1199.99,
      quantity: 45,
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
      name: "Nike Air Max 270",
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
      name: "Breville Coffee Maker",
      category: "Home",
      price: 89.99,
      quantity: 30,
      status: "Active",
      date: "2024-01-22"
    },
    {
      id: 6,
      name: "Samsung Galaxy S24 Ultra",
      category: "Electronics",
      price: 1299.99,
      quantity: 75,
      status: "Active",
      date: "2024-01-18"
    },
    {
      id: 7,
      name: "Adidas Originals T-Shirt",
      category: "Clothing",
      price: 29.99,
      quantity: 150,
      status: "Active",
      date: "2024-01-14"
    },
    {
      id: 8,
      name: "JavaScript: The Definitive Guide",
      category: "Books",
      price: 45.99,
      quantity: 80,
      status: "Active",
      date: "2024-01-10"
    },
    {
      id: 9,
      name: "Dyson V15 Vacuum",
      category: "Home",
      price: 649.99,
      quantity: 20,
      status: "Active",
      date: "2024-01-05"
    },
    {
      id: 10,
      name: "Wilson Pro Tennis Racket",
      category: "Sports",
      price: 129.99,
      quantity: 40,
      status: "Active",
      date: "2024-01-25"
    }
  ],
  nextId: 11
};

// Add more sample data to reach 50 items
for (let i = 11; i <= 50; i++) {
  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];
  const statuses = ["Active", "Inactive"];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  database.products.push({
    id: i,
    name: `Sample Product ${i}`,
    category: category,
    price: Math.round((Math.random() * 2000 + 10) * 100) / 100,
    quantity: Math.floor(Math.random() * 200 + 1),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(2024, 0, Math.floor(Math.random() * 30 + 1)).toISOString().split('T')[0]
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// GET /api/products - Get all products with filtering and pagination
app.get('/api/products', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = '',
      minPrice = '',
      maxPrice = '',
      sortBy = 'id',
      sortOrder = 'asc'
    } = req.query;

    let filteredProducts = [...database.products];

    // Apply filters
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (status) {
      filteredProducts = filteredProducts.filter(product => 
        product.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= parseFloat(maxPrice)
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });

    // Calculate aggregations
    const totalRecords = filteredProducts.length;
    const avgPrice = totalRecords > 0 ? 
      filteredProducts.reduce((sum, p) => sum + p.price, 0) / totalRecords : 0;
    const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const maxPriceValue = totalRecords > 0 ? 
      Math.max(...filteredProducts.map(p => p.price)) : 0;

    // Apply pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const totalPages = Math.ceil(totalRecords / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: totalRecords,
        limit: limitNum
      },
      aggregations: {
        totalRecords,
        avgPrice,
        totalValue,
        maxPrice: maxPriceValue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Export for serverless deployment
export default app;
