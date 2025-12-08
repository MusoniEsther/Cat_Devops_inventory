# 📦 Inventory Management System

A simple and elegant inventory management system built with HTML, CSS, and JavaScript. Users can manage inventory items with persistent local storage.

## Features

- ✅ User authentication with login page
- ✅ Add, view, and delete inventory items
- ✅ Data persistence using localStorage
- ✅ RWF currency format support
- ✅ Responsive design for mobile and desktop
- ✅ Clean and intuitive UI

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/inventory-system.git
cd Inventory_System
```

2. Open in browser
```bash
# Simply open index.html in your web browser
open index.html
```

## Usage

### Login
- **Username:** admin
- **Password:** admin

### Adding Items
1. Login to the system
2. Fill in Item Name, Quantity, Price (RWF), and Category
3. Click "Add Item"
4. Item appears in the Inventory List

### Managing Inventory
- View all items in the table
- Delete items using the Delete button
- Data automatically saves to browser localStorage

### Logout
- Click "Logout" button in top navigation
- Session clears and redirects to login page

## File Structure

```
Inventory_System/
├── index.html          # Login page
├── dashboard.html      # Inventory management dashboard
├── login.html          # Alternative login file
├── README.md          # Project documentation
├── .gitignore         # Git ignore rules
└── .github/
    └── workflows/
        ├── deploy.yml      # CI/CD pipeline
        └── codeql.yml      # Security analysis
```

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling and animations
- **JavaScript (Vanilla)** - Functionality
- **localStorage API** - Data persistence

## Data Structure

### Inventory Item
```javascript
{
  itemName: "Product Name",
  quantity: 10,
  price: 5000,
  category: "Electronics"
}
```

## Security Notes

- ⚠️ This is a demo application
- Credentials are hardcoded (admin/admin)
- Data stored in browser localStorage (not encrypted)
- For production: Use backend authentication and database

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Backend API integration
- [ ] User registration
- [ ] Multiple user accounts
- [ ] Data export (CSV/PDF)
- [ ] Search and filter functionality
- [ ] Edit item functionality
- [ ] Inventory reports

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---
**Created with ❤️ for inventory management**

