import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../services/productApi';
import './ProductForm.css';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    productImage: '',
    productCategory: '',
    productStatus: 'Available',
    productDate: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await getProductById(id);
      setFormData({
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        productImage: product.productImage,
        productCategory: product.productCategory,
        productStatus: product.productStatus,
        productDate: product.productDate
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load product details');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if user is logged in
    if (!currentUser) {
      setError('You must be logged in to add products');
      return;
    }

    // Validation
    if (!formData.productName || !formData.productPrice) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.productPrice <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      // Add user object to formData
      const productData = {
        ...formData,
        user: {
          userID: currentUser.userID
        }
      };

      if (isEditMode) {
        await updateProduct(id, productData);
        alert('Product updated successfully!');
      } else {
        await createProduct(productData);
        alert('Product created successfully!');
      }
      navigate('/products');
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading product...</div>;
  }

  return (
    <div className="product-form-container">
      <button className="back-button" onClick={() => navigate('/products')}>← Back to Products</button>
      
      <div className="product-form-card">
        <h2>{isEditMode ? 'Edit Product' : 'Create New Product'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="productName">Product Name *</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productPrice">Price *</label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productImage">Image URL</label>
            <input
              type="url"
              id="productImage"
              name="productImage"
              value={formData.productImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productCategory">Category</label>
            <input
              type="text"
              id="productCategory"
              name="productCategory"
              value={formData.productCategory}
              onChange={handleChange}
              placeholder="Enter category"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productStatus">Status</label>
            <select
              id="productStatus"
              name="productStatus"
              value={formData.productStatus}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="productDate">Date</label>
            <input
              type="date"
              id="productDate"
              name="productDate"
              value={formData.productDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}