# Data Table System

A comprehensive web application built with Vite that features an advanced data table with search, filter, and aggregation capabilities.

## ✨ Features

### 🔍 **Search & Filter**
- **Real-time search** across all table columns
- **Category filtering** by product categories
- **Status filtering** (Active, Inactive, Discontinued)
- **Price range filtering** with min/max controls
- **Combined filters** work together for precise data selection

### 📊 **Data Management**
- **Sortable columns** - Click any column header to sort
- **Pagination** with customizable page sizes (10, 25, 50, 100 items)
- **Add new records** via modal form
- **Edit existing records** with inline editing
- **Delete records** with confirmation
- **CSV export** functionality

### 📈 **Real-time Aggregation**
- **Total Records** count (filtered)
- **Average Price** calculation
- **Total Value** (price × quantity sum)
- **Maximum Price** in filtered dataset

### 📱 **User Experience**
- **Responsive design** - works on desktop, tablet, and mobile
- **Modern UI** with smooth animations and hover effects
- **Status badges** with color coding
- **Modal dialogs** for data entry
- **Loading states** and error handling

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite (fast development and optimized production builds)
- **Styling**: Modern CSS with Grid, Flexbox, and CSS animations
- **Data**: Local JavaScript objects (easily adaptable to APIs)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download** this project
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder, ready for deployment.

## 🌐 Deployment Options

This project can be deployed to any static hosting service:

### **Free Hosting Options:**
- **Netlify**: Drag & drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Upload the `dist` contents
- **Surge.sh**: Use `surge dist/` command
- **Firebase Hosting**: Use Firebase CLI

### **Deployment Steps:**
1. Run `npm run build`
2. Upload the `dist/` folder contents to your hosting service
3. Your app is live! 🎉

## 📁 Project Structure

```
FakeDemo/
├── src/
│   ├── main.js          # Application entry point
│   ├── dataTable.js     # Main DataTable class
│   ├── sampleData.js    # Sample data and generators
│   └── style.css        # All styling
├── index.html           # Main HTML file
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🎯 Usage Examples

### **Search Functionality**
- Type in the search box to filter across all columns
- Search works on: names, categories, prices, quantities, status

### **Advanced Filtering**
- Use category dropdown to filter by product type
- Set price range with min/max inputs
- Combine multiple filters for precise results

### **Data Operations**
- **Add new record**: Click "Add Record" button
- **Edit record**: Click "Edit" button in any row
- **Delete record**: Click "Delete" button (with confirmation)
- **Export data**: Click "Export CSV" to download filtered data

### **Sorting & Pagination**
- Click column headers to sort (click again to reverse)
- Use pagination controls to navigate large datasets
- Change page size with the dropdown

## 🧪 Testing

This application is designed to be tested with automation frameworks like:
- **Playwright** (recommended)
- **Cypress**
- **Selenium**

Key testing targets:
- Search functionality
- Filter combinations
- CRUD operations (Create, Read, Update, Delete)
- Sorting and pagination
- Data aggregation accuracy
- Responsive behavior

## 🎨 Customization

### **Adding New Data Fields**
1. Update `sampleData.js` with new fields
2. Modify table headers in `index.html`
3. Update the DataTable class to handle new fields
4. Add corresponding CSS if needed

### **Styling Changes**
- All styles are in `src/style.css`
- CSS variables at the top for easy color customization
- Responsive breakpoints already defined

### **Data Source Integration**
- Replace `sampleData.js` with API calls
- Modify DataTable class methods to handle async operations
- Add loading states and error handling

## 📊 Sample Data

The application comes with 25 sample product records including:
- Electronics (phones, laptops, tablets)
- Clothing (shirts, shoes, jackets)
- Books (programming, fiction)
- Home items (appliances, furniture)
- Sports equipment

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

---

**Ready to test?** The application includes comprehensive functionality perfect for automation testing scenarios! 🚀
