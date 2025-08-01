// API service layer for communicating with the backend
export class ApiService {
  constructor(baseUrl = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET /api/products - Fetch products with filtering and pagination
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters to query parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // GET /api/products/:id - Fetch single product
  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // POST /api/products - Create new product
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  // PUT /api/products/:id - Update product
  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  // DELETE /api/products/:id - Delete product
  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // GET /api/stats - Get database statistics
  async getStats() {
    return this.request('/stats');
  }

  // GET /api/health - Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Export data to CSV (client-side processing)
  exportToCSV(data, filename = 'data-export.csv') {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Quantity', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.id,
        `"${item.name}"`,
        item.category,
        item.price,
        item.quantity,
        item.status,
        item.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Test all API endpoints (useful for testing)
  async testAllEndpoints() {
    console.log('🧪 Testing API endpoints...');
    
    try {
      // Health check
      console.log('1. Health check...');
      const health = await this.healthCheck();
      console.log('✅ Health check passed:', health);

      // Get stats
      console.log('2. Getting stats...');
      const stats = await this.getStats();
      console.log('✅ Stats retrieved:', stats);

      // Get products
      console.log('3. Getting products...');
      const products = await this.getProducts({ limit: 5 });
      console.log('✅ Products retrieved:', products);

      // Test filtering
      console.log('4. Testing filters...');
      const filtered = await this.getProducts({ 
        category: 'Electronics', 
        minPrice: 100 
      });
      console.log('✅ Filtered products:', filtered);

      // Test search
      console.log('5. Testing search...');
      const searched = await this.getProducts({ search: 'iPhone' });
      console.log('✅ Search results:', searched);

      console.log('🎉 All API tests passed!');
      return true;
    } catch (error) {
      console.error('❌ API test failed:', error);
      return false;
    }
  }
}
