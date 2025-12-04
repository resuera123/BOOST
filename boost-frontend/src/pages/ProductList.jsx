import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsByUser, deleteProduct } from '../services/productApi';
import './ProductList.css';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.userID) {
        throw new Error('User not logged in');
      }
      
      // Fetch only current user's products
      const data = await getProductsByUser(user.userID);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh the list
        alert('Product deleted successfully!');
      } catch (err) {
        alert(err.message || 'Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      {/* ✅ Back Button - Fixed at top left */}
      <button className="back-button-fixed" onClick={() => navigate('/home')}>
        <i className="bi bi-arrow-left"></i>
      </button>

      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-lightning-charge-fill"></i> BOOSTS
          </div>
          <nav className="header-nav">
            <span className="user-greeting">
              👤 Welcome, {user?.firstname || 'Student'}
              {(user?.role === 'SELLER' || user?.role === 'seller') && (
                <span className="seller-badge">✓ Seller</span>
              )}
            </span>
            {(user?.role === 'SELLER' || user?.role === 'seller') ? (
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

      {/* Product List Content */}
      <div className="header-actions">
          <h2>Your Products</h2>
          <button 
            className="btn-add-new"
            onClick={() => navigate('/products/new')}
          >
            + Add New Product
          </button>
        </div>
        
        <div className="product-grid">
          {products.length === 0 ? (
            <p className="no-products">No products available. Start by adding your first product!</p>
          ) : (
            products.map((product) => (
              <div key={product.productID} className="product-card">
                {product.productImage && (
                  <img 
                    src={product.productImage} 
                    alt={product.productName || 'Product'}
                    className="product-image"
                  />
                )}
                <div className="product-details">
                  <h3>{product.productName || 'Unnamed Product'}</h3>
                  <p className="product-description">
                    {product.productDescription || 'No description available'}
                  </p>
                  <p className="product-price">
                    ${product.productPrice ? product.productPrice.toFixed(2) : '0.00'}
                  </p>
                  <p className="product-category">
                    Category: {product.productCategory || 'Uncategorized'}
                  </p>
                  <p className={`product-status ${product.productStatus ? product.productStatus.toLowerCase() : 'unknown'}`}>
                    Status: {product.productStatus || 'Unknown'}
                  </p>
                  <p className="product-date">
                    Listed: {product.productDate ? new Date(product.productDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className="product-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => navigate(`/products/edit/${product.productID}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(product.productID)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  );
}