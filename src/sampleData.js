// Sample data for the data table system
export const sampleData = [
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
  },
  {
    id: 11,
    name: "iPad Pro",
    category: "Electronics",
    price: 1099.99,
    quantity: 35,
    status: "Active",
    date: "2024-01-16"
  },
  {
    id: 12,
    name: "Levi's Jeans",
    category: "Clothing",
    price: 79.99,
    quantity: 120,
    status: "Active",
    date: "2024-01-11"
  },
  {
    id: 13,
    name: "Python Cookbook",
    category: "Books",
    price: 59.99,
    quantity: 60,
    status: "Active",
    date: "2024-01-07"
  },
  {
    id: 14,
    name: "Desk Lamp",
    category: "Home",
    price: 39.99,
    quantity: 90,
    status: "Active",
    date: "2024-01-23"
  },
  {
    id: 15,
    name: "Basketball",
    category: "Sports",
    price: 24.99,
    quantity: 70,
    status: "Active",
    date: "2024-01-19"
  },
  {
    id: 16,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 149.99,
    quantity: 85,
    status: "Active",
    date: "2024-01-13"
  },
  {
    id: 17,
    name: "Winter Jacket",
    category: "Clothing",
    price: 199.99,
    quantity: 45,
    status: "Active",
    date: "2024-01-09"
  },
  {
    id: 18,
    name: "React Handbook",
    category: "Books",
    price: 39.99,
    quantity: 95,
    status: "Active",
    date: "2024-01-06"
  },
  {
    id: 19,
    name: "Blender",
    category: "Home",
    price: 79.99,
    quantity: 25,
    status: "Discontinued",
    date: "2024-01-04"
  },
  {
    id: 20,
    name: "Golf Clubs Set",
    category: "Sports",
    price: 499.99,
    quantity: 15,
    status: "Active",
    date: "2024-01-21"
  },
  {
    id: 21,
    name: "Smart Watch",
    category: "Electronics",
    price: 299.99,
    quantity: 60,
    status: "Active",
    date: "2024-01-17"
  },
  {
    id: 22,
    name: "Running Shoes",
    category: "Clothing",
    price: 119.99,
    quantity: 110,
    status: "Active",
    date: "2024-01-24"
  },
  {
    id: 23,
    name: "Data Science Book",
    category: "Books",
    price: 69.99,
    quantity: 50,
    status: "Active",
    date: "2024-01-03"
  },
  {
    id: 24,
    name: "Air Fryer",
    category: "Home",
    price: 129.99,
    quantity: 40,
    status: "Active",
    date: "2024-01-26"
  },
  {
    id: 25,
    name: "Yoga Mat",
    category: "Sports",
    price: 29.99,
    quantity: 80,
    status: "Active",
    date: "2024-01-02"
  }
];

// Function to generate additional random data
export function generateRandomData(count = 10) {
  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];
  const statuses = ["Active", "Inactive", "Discontinued"];
  const names = [
    "Smart TV", "Laptop", "Mouse", "Keyboard", "Monitor",
    "Shirt", "Pants", "Dress", "Hat", "Socks",
    "Novel", "Textbook", "Magazine", "Comics", "Dictionary",
    "Chair", "Table", "Sofa", "Bed", "Pillow",
    "Football", "Baseball", "Soccer Ball", "Helmet", "Gloves"
  ];
  
  const data = [];
  for (let i = 0; i < count; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPrice = Math.floor(Math.random() * 1000) + 10;
    const randomQuantity = Math.floor(Math.random() * 200) + 1;
    const randomDate = new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0];
    
    data.push({
      id: sampleData.length + i + 1,
      name: `${randomName} ${i + 1}`,
      category: randomCategory,
      price: randomPrice,
      quantity: randomQuantity,
      status: randomStatus,
      date: randomDate
    });
  }
  
  return data;
}
