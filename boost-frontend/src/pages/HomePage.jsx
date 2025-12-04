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
    
    // Fetch real products from backend
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/products/getAllProducts');
      const data = await response.json();
      
      // Transform backend data to match your frontend format
      const transformedProducts = data.map(product => ({
        productID: product.productID,
        productName: product.productName|| 'Unnamed Product',
        description: product.productDescription|| 'No description available',
        price: product.productPrice || 0,
        category: product.productCategory || 'Uncategorized',
        seller: product.user ? `${product.user.firstname} ${product.user.lastname}` : 'Unknown Seller',
        rating: 4.5, // You can add ratings to backend later
        image: product.productImage || 'https://via.placeholder.com/300x200?text=No+Image'
      }));
      
      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    }
  };

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
          <div className="logo"><i className="bi bi-lightning-charge-fill"></i> BOOSTS</div>
          <nav className="header-nav">
            <span className="user-greeting">
              👤 Welcome, {user?.firstname || 'Student'}
              {user?.role === 'SELLER' && (
                <span className="seller-badge">✓ Seller</span>
              )}
              {user?.role === 'ADMIN' && (
                <span className="admin-badge">⚡ ADMIN</span>
              )}
            </span>
            {user?.role === 'ADMIN' ? (
              <button className="nav-btn admin-btn" onClick={() => navigate('/admin')}>
                Admin Panel
              </button>
            ) : user?.role === 'SELLER' ? (
              <button className="nav-btn" onClick={() => navigate('/products')}>
                My Products
              </button>
            ) : (
              <button className="nav-btn" onClick={() => navigate('/seller-application')}>
                Become a Seller
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout&nbsp;&nbsp;<i className="bi bi-box-arrow-right"></i>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-homepage">
        <h1>Student Marketplace</h1>
        <p>Discover great deals from verified student sellers</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button><i className="bi bi-search"></i></button>
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
                  <span className="seller-name"><i className="bi bi-heart-fill"></i>&nbsp; {product.seller}</span>
                  <span className="rating"><i className="bi bi-star-fill"></i>&nbsp; {product.rating}</span>
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