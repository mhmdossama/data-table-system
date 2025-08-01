import './style.css'
import { DataTable } from './dataTable.js'

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const dataTable = new DataTable('dataTable');
  dataTable.init();
});

// Initialize on module load as well (for Vite hot reload)
const dataTable = new DataTable('dataTable');
dataTable.init();
