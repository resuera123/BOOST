import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Mock products data - replace with API call later
    const mockProducts = [
      {
        productID: 1,
        productName: 'Calculus Textbook - 10th Edition',
        description: 'Like new condition. All chapters included. Great for Math 101.',
        price: 45,
        category: 'Textbooks',
        seller: 'Jane Seller',
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200?text=Calculus+Textbook'
      },
      {
        productID: 2,
        productName: 'MacBook Air M1 - 2020',
        description: 'Excellent condition, barely used. 8GB RAM, 256GB SSD. Includes charger.',
        price: 750,
        category: 'Electronics',
        seller: 'Jane Seller',
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200?text=MacBook+Air'
      },
      {
        productID: 3,
        productName: 'Handmade Campus Tote Bag',
        description: 'Eco-friendly canvas tote with university logo. Perfect for carrying books.',
        price: 20,
        category: 'Accessories',
        seller: 'Jane Seller',
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200?text=Tote+Bag'
      },
      {
        productID: 4,
        productName: 'Physics Lab Manual',
        description: 'Complete lab manual with all experiments. Used once.',
        price: 30,
        category: 'Textbooks',
        seller: 'John Seller',
        rating: 4.5,
        image: 'https://via.placeholder.com/300x200?text=Physics+Manual'
      },
      {
        productID: 5,
        productName: 'Wireless Headphones',
        description: 'Noise-cancelling, Bluetooth 5.0. Great for studying.',
        price: 60,
        category: 'Electronics',
        seller: 'Sarah Seller',
        rating: 4.7,
        image: 'https://via.placeholder.com/300x200?text=Headphones'
      },
      {
        productID: 6,
        productName: 'Study Desk Lamp',
        description: 'LED lamp with adjustable brightness. Perfect for late night studying.',
        price: 25,
        category: 'Accessories',
        seller: 'Mike Seller',
        rating: 4.6,
        image: 'https://via.placeholder.com/300x200?text=Desk+Lamp'
      }
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(searchQuery, category);
  };

  const filterProducts = (query, category) => {
    let filtered = products;

    if (category !== 'All Categories') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (query.trim()) {
      filtered = filtered.filter(p =>
        p.productName.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const categories = ['All Categories', 'Textbooks', 'Electronics', 'Accessories'];

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo">⚡ BOOSTS</div>
          <nav className="header-nav">
            <span className="user-greeting">👤 {user?.firstname || 'Student'}</span>
            <button className="nav-btn">Become a Seller</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Student Marketplace</h1>
        <p>Discover great deals from verified student sellers</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button>🔍</button>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="filters">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <span className="product-count">{filteredProducts.length} products found</span>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.productID} className="product-card">
                <img src={product.image} alt={product.productName} className="product-image" />
                <h3>{product.productName}</h3>
                <p className="category-badge">{product.category}</p>
                <p className="description">{product.description}</p>
                <div className="seller-info">
                  <span className="seller-name">💚 {product.seller}</span>
                  <span className="rating">⭐ {product.rating}</span>
                </div>
                <div className="product-footer">
                  <span className="price">${product.price}</span>
                  <button className="contact-btn">Contact Seller</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No products found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}