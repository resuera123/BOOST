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
    productStatus: 'Available'
  });

  const [imagePreview, setImagePreview] = useState(null);
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
        productStatus: product.productStatus
      });
      
      // Set image preview if image exists
      if (product.productImage) {
        setImagePreview(product.productImage);
      }
      
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({ ...prev, productImage: base64String }));
      setImagePreview(base64String);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, productImage: '' }));
    setImagePreview(null);
    // Clear file input
    document.getElementById('productImage').value = '';
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
      // Add user object and current date to formData
      const productData = {
        ...formData,
        productDate: new Date().toISOString().split('T')[0], // Auto-set current date
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/home')}>
            <i className="bi bi-lightning-charge-fill"></i> BOOSTS
          </div>
          <nav className="header-nav">
            <span className="user-greeting">
              👤 Welcome, {currentUser?.firstname || 'Student'}
              {currentUser?.role === 'SELLER' && (
                <span className="seller-badge">✓ Seller</span>
              )}
            </span>
            {currentUser?.role === 'SELLER' ? (
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
      
      <div className="product-form-container">
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

            {/* IMAGE UPLOAD SECTION */}
            <div className="form-group">
              <label htmlFor="productImage">Product Image</label>
              
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button 
                    type="button" 
                    className="btn-remove-image"
                    onClick={handleRemoveImage}
                  >
                    ✕ Remove Image
                  </button>
                </div>
              ) : (
                <div className="upload-container">
                  <label htmlFor="productImage" className="upload-label">
                    <i className="bi bi-cloud-upload"></i>
                    <span>Click to upload image</span>
                    <small>PNG, JPG, JPEG (Max 5MB)</small>
                  </label>
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                </div>
              )}
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
    </div>
  );
}