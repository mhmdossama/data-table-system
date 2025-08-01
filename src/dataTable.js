// DataTable class with API integration for search, filter, and aggregation functionality
import { ApiService } from './apiService.js';

export class DataTable {
  constructor(tableId, initialData = []) {
    this.tableId = tableId;
    this.apiService = new ApiService();
    this.currentPage = 1;
    this.pageSize = 10;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.editingId = null;
    this.isLoading = false;
    
    // Initialize filter options
    this.filterOptions = {
      search: '',
      category: '',
      status: '',
      minPrice: '',
      maxPrice: ''
    };

    // Store current data and pagination info
    this.currentData = [];
    this.paginationInfo = {};
    this.aggregationData = {};
  }

  async init() {
    this.setupEventListeners();
    await this.loadInitialData();
    this.renderTable();
    this.updateAggregation();
    this.updatePagination();
  }

  async loadInitialData() {
    try {
      this.setLoading(true);
      
      // Test API connection first
      const healthCheck = await this.apiService.healthCheck();
      console.log('API Health Check:', healthCheck);
      
      // Load initial data
      await this.fetchAndRenderData();
      await this.populateFilterOptions();
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
      this.showError('Failed to connect to the backend server. Please make sure the server is running on port 3001.');
    } finally {
      this.setLoading(false);
    }
  }

  async fetchAndRenderData() {
    try {
      this.setLoading(true);
      
      const filters = {
        ...this.filterOptions,
        page: this.currentPage,
        limit: this.pageSize,
        ...(this.sortColumn && { sortBy: this.sortColumn, sortOrder: this.sortDirection })
      };

      const response = await this.apiService.getProducts(filters);
      
      if (response.success) {
        this.currentData = response.data;
        this.paginationInfo = response.pagination;
        this.aggregationData = response.aggregations;
        
        this.renderTable();
        this.updateAggregation();
        this.updatePagination();
        this.updateSortIcons();
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.showError('Failed to fetch data from server');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    if (loading) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="loading-cell">
            <div class="loading-spinner"></div>
            <span>Loading data...</span>
          </td>
        </tr>
      `;
    }
  }

  showError(message) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="error-cell">
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            <span>${message}</span>
            <button onclick="location.reload()" class="retry-btn">Retry</button>
          </div>
        </td>
      </tr>
    `;
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput?.addEventListener('input', (e) => {
      this.filterOptions.search = e.target.value;
      this.applyFilters();
    });
    
    clearSearch?.addEventListener('click', () => {
      searchInput.value = '';
      this.filterOptions.search = '';
      this.applyFilters();
    });

    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');

    categoryFilter?.addEventListener('change', (e) => {
      this.filterOptions.category = e.target.value;
      this.applyFilters();
    });

    statusFilter?.addEventListener('change', (e) => {
      this.filterOptions.status = e.target.value;
      this.applyFilters();
    });

    minPrice?.addEventListener('input', (e) => {
      this.filterOptions.minPrice = e.target.value;
      this.applyFilters();
    });

    maxPrice?.addEventListener('input', (e) => {
      this.filterOptions.maxPrice = e.target.value;
      this.applyFilters();
    });

    // Pagination
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageSize = document.getElementById('pageSize');

    prevPage?.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchAndRenderData();
      }
    });

    nextPage?.addEventListener('click', () => {
      if (this.currentPage < this.paginationInfo.totalPages) {
        this.currentPage++;
        this.fetchAndRenderData();
      }
    });

    pageSize?.addEventListener('change', (e) => {
      this.pageSize = parseInt(e.target.value);
      this.currentPage = 1;
      this.fetchAndRenderData();
    });

    // Table sorting
    const table = document.getElementById(this.tableId);
    table?.addEventListener('click', (e) => {
      if (e.target.closest('.sortable')) {
        const column = e.target.closest('.sortable').dataset.column;
        this.sortData(column);
      }
      
      // Handle action buttons
      if (e.target.classList.contains('edit-btn')) {
        const id = parseInt(e.target.dataset.id);
        this.editRecord(id);
      }
      
      if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.id);
        this.deleteRecord(id);
      }
    });

    // Export functionality
    const exportBtn = document.getElementById('exportData');
    exportBtn?.addEventListener('click', () => this.exportToCSV());

    // Add record functionality
    const addBtn = document.getElementById('addRecord');
    addBtn?.addEventListener('click', () => this.showModal());

    // Modal functionality
    this.setupModalEventListeners();

    // API Test button (for development)
    this.addTestButton();
  }

  addTestButton() {
    const controls = document.querySelector('.table-controls');
    if (controls && !document.getElementById('testApiBtn')) {
      const testBtn = document.createElement('button');
      testBtn.id = 'testApiBtn';
      testBtn.textContent = 'Test API';
      testBtn.style.cssText = 'background-color: #17a2b8; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 500;';
      testBtn.addEventListener('click', () => this.testAPI());
      controls.appendChild(testBtn);
    }
  }

  async testAPI() {
    console.log('🧪 Starting API tests...');
    const success = await this.apiService.testAllEndpoints();
    
    if (success) {
      alert('✅ All API tests passed! Check console for details.');
    } else {
      alert('❌ Some API tests failed. Check console for details.');
    }
  }

  setupModalEventListeners() {
    const modal = document.getElementById('recordModal');
    const closeModal = document.getElementById('closeModal');
    const cancelRecord = document.getElementById('cancelRecord');
    const recordForm = document.getElementById('recordForm');

    closeModal?.addEventListener('click', () => this.hideModal());
    cancelRecord?.addEventListener('click', () => this.hideModal());
    
    // Close modal when clicking outside
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideModal();
      }
    });

    recordForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveRecord();
    });
  }

  async populateFilterOptions() {
    try {
      const stats = await this.apiService.getStats();
      if (stats.success) {
        const categories = stats.data.categories.map(c => c.category);
        const statuses = stats.data.statuses.map(s => s.status);

        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');

        // Clear existing options (except "All")
        if (categoryFilter) {
          categoryFilter.innerHTML = '<option value="">All Categories</option>';
          categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
          });
        }

        if (statusFilter) {
          statusFilter.innerHTML = '<option value="">All Status</option>';
          statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            statusFilter.appendChild(option);
          });
        }
      }
    } catch (error) {
      console.error('Error populating filter options:', error);
    }
  }

  async applyFilters() {
    this.currentPage = 1;
    await this.fetchAndRenderData();
  }

  async sortData(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    await this.fetchAndRenderData();
  }

  updateSortIcons() {
    // Reset all sort icons
    document.querySelectorAll('.sort-icon').forEach(icon => {
      icon.textContent = '↕';
    });

    // Update current sort icon
    if (this.sortColumn) {
      const sortHeader = document.querySelector(`[data-column="${this.sortColumn}"] .sort-icon`);
      if (sortHeader) {
        sortHeader.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
      }
    }
  }

  renderTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody || this.isLoading) return;

    if (this.currentData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="no-data-cell">
            <div class="no-data-message">
              <span class="no-data-icon">📭</span>
              <span>No data found matching your filters</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.currentData.map(item => `
      <tr data-id="${item.id}">
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>
          <span class="status-badge status-${item.status.toLowerCase()}">
            ${item.status}
          </span>
        </td>
        <td>${new Date(item.date).toLocaleDateString()}</td>
        <td class="actions">
          <button class="edit-btn" data-id="${item.id}">Edit</button>
          <button class="delete-btn" data-id="${item.id}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  updateAggregation() {
    if (!this.aggregationData) return;

    const { totalRecords, avgPrice, totalValue, maxPrice } = this.aggregationData;

    document.getElementById('totalRecords').textContent = totalRecords || 0;
    document.getElementById('avgPrice').textContent = `$${(avgPrice || 0).toFixed(2)}`;
    document.getElementById('totalValue').textContent = `$${(totalValue || 0).toFixed(2)}`;
    document.getElementById('maxPriceAgg').textContent = `$${(maxPrice || 0).toFixed(2)}`;
  }

  updatePagination() {
    if (!this.paginationInfo) return;

    const { currentPage, totalPages } = this.paginationInfo;
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  showModal(record = null) {
    const modal = document.getElementById('recordModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('recordForm');

    this.editingId = record ? record.id : null;
    modalTitle.textContent = record ? 'Edit Record' : 'Add New Record';

    if (record) {
      document.getElementById('recordName').value = record.name;
      document.getElementById('recordCategory').value = record.category;
      document.getElementById('recordPrice').value = record.price;
      document.getElementById('recordQuantity').value = record.quantity;
      document.getElementById('recordStatus').value = record.status;
    } else {
      form.reset();
    }

    modal.style.display = 'block';
  }

  hideModal() {
    const modal = document.getElementById('recordModal');
    modal.style.display = 'none';
    this.editingId = null;
  }

  async saveRecord() {
    const name = document.getElementById('recordName').value;
    const category = document.getElementById('recordCategory').value;
    const price = parseFloat(document.getElementById('recordPrice').value);
    const quantity = parseInt(document.getElementById('recordQuantity').value);
    const status = document.getElementById('recordStatus').value;

    const recordData = {
      name,
      category,
      price,
      quantity,
      status
    };

    try {
      this.setLoading(true);
      
      if (this.editingId) {
        // Edit existing record
        const response = await this.apiService.updateProduct(this.editingId, recordData);
        if (response.success) {
          console.log('Product updated successfully:', response.data);
        }
      } else {
        // Add new record
        const response = await this.apiService.createProduct(recordData);
        if (response.success) {
          console.log('Product created successfully:', response.data);
        }
      }

      await this.fetchAndRenderData();
      this.hideModal();
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Failed to save record: ' + error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async editRecord(id) {
    try {
      const response = await this.apiService.getProduct(id);
      if (response.success) {
        this.showModal(response.data);
      }
    } catch (error) {
      console.error('Error fetching product for edit:', error);
      alert('Failed to load product data: ' + error.message);
    }
  }

  async deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        this.setLoading(true);
        const response = await this.apiService.deleteProduct(id);
        if (response.success) {
          console.log('Product deleted successfully:', response.data);
          await this.fetchAndRenderData();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record: ' + error.message);
      } finally {
        this.setLoading(false);
      }
    }
  }

  async exportToCSV() {
    try {
      // Get all data for export (without pagination)
      const response = await this.apiService.getProducts({
        ...this.filterOptions,
        limit: 10000 // Large number to get all data
      });
      
      if (response.success) {
        this.apiService.exportToCSV(response.data, 'data-table-export.csv');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data: ' + error.message);
    }
  }

  // Method to add bulk data (useful for testing)
  async addBulkData(newData) {
    try {
      for (const product of newData) {
        await this.apiService.createProduct(product);
      }
      await this.fetchAndRenderData();
      await this.populateFilterOptions();
    } catch (error) {
      console.error('Error adding bulk data:', error);
    }
  }
}
