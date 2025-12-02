import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsByUser, deleteProduct } from '../services/productApi';
import './ProductList.css';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <button className="back-button" onClick={() => navigate('/home')}>
        ← Back to Home
      </button>

      <div className="header-actions">
        <h2>Product List</h2>
        <button 
          className="btn-add-new"
          onClick={() => navigate('/products/new')}
        >
          + Add New Product
        </button>
      </div>
      
      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products available.</p>
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
                <p className="product-description">{product.productDescription || 'No description available'}</p>
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