import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState(['All Categories']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // reviews state (added)
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [newReviewMessage, setNewReviewMessage] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);


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
        productName: product.productName || 'Unnamed Product',
        description: product.productDescription || 'No description available',
        price: product.productPrice || 0,
        category: product.productCategory || 'Uncategorized',
        seller: product.user ? `${product.user.firstname} ${product.user.lastname}` : 'Unknown Seller',
        sellerEmail: product.user?.email || 'N/A',
        sellerPhone: product.user?.phone || 'N/A',
        rating: 0, // will be replaced by computed average below
        image: product.productImage || 'https://via.placeholder.com/300x200?text=No+Image',
        status: product.productStatus || 'Available',
        listedDate: product.productDate ? new Date(product.productDate).toLocaleDateString() : 'N/A'
      }));

      // Fetch all recommendations and compute average rating per product
      try {
        const recRes = await fetch('http://localhost:8080/recommendations');
        if (recRes.ok) {
          const recs = await recRes.json();
          const sums = {};
          const counts = {};

          recs.forEach(r => {
            // support both nested product object and direct productID field
            const pid = r?.product?.productID ?? r?.productID;
            const rating = Number(r?.rating ?? 0);
            if (!pid) return;
            sums[pid] = (sums[pid] || 0) + (isNaN(rating) ? 0 : rating);
            counts[pid] = (counts[pid] || 0) + (isNaN(rating) ? 0 : 1);
          });

          // apply average rating to transformedProducts
          transformedProducts.forEach(p => {
            const sum = sums[p.productID];
            const count = counts[p.productID];
            if (count && count > 0) {
              const avg = sum / count;
              // round to one decimal place for display
              p.rating = Math.round(avg * 10) / 10;
            } else {
              p.rating = 0; // or set to null / '-' if you prefer
            }
          });
        } else {
          console.warn('Could not load recommendations, leaving default ratings');
        }
      } catch (recErr) {
        console.warn('Error fetching recommendations:', recErr);
      }

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);

      const dynamicCategories = [
        'All Categories',
        ...Array.from(new Set(transformedProducts.map(p => p.category)))
      ];

      setCategories(dynamicCategories);
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

  const openContactModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeContactModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // reviews helpers (added)
  const fetchReviews = async (productID) => {
    setReviewsError('');
    setReviewsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/recommendations/product/${productID}`);
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      setReviews(data || []);
    } catch (err) {
      setReviewsError(err.message || 'Error loading reviews');
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const openReviewsModal = (product) => {
    setSelectedProduct(product);
    fetchReviews(product.productID);
    setIsReviewsOpen(true);
  };

  const closeReviewsModal = () => {
    setIsReviewsOpen(false);
    setSelectedProduct(null);
    setNewReviewMessage('');
    setNewReviewRating(5);
    setReviewsError('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewsError('You must be logged in to submit a review.');
      return;
    }

    // Prevent more than one review per user per product
    const alreadyReviewed = reviews.some(r => {
      // r.user should be the user object returned from backend; guard defensively
      if (!r || !r.user) return false;
      return Number(r.user.userID) === Number(user.userID);
    });

    if (alreadyReviewed) {
      setReviewsError('You have already submitted a review for this product.');
      return;
    }

    if (!newReviewMessage.trim()) {
      setReviewsError('Please enter a review message.');
      return;
    }

    setSubmittingReview(true);
    setReviewsError('');
    try {
      const payload = {
        userID: user.userID,
        productID: selectedProduct.productID,
        message: newReviewMessage,
        rating: newReviewRating,
        dateGenerated: new Date().toISOString().split('T')[0]
      };

      const res = await fetch('http://localhost:8080/recommendations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to submit review');
      }

      // refresh reviews
      await fetchReviews(selectedProduct.productID);
      setNewReviewMessage('');
      setNewReviewRating(5);
    } catch (err) {
      setReviewsError(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // delete review (only allowed for the review owner)
  const handleDeleteReview = async (recommendationID) => {
    if (!user) {
      setReviewsError('You must be logged in to delete a review.');
      return;
    }
    if (!window.confirm('Delete this review?')) return;

    try {
      const res = await fetch(`http://localhost:8080/recommendations/${recommendationID}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to delete review');
      }
      // refresh reviews after delete
      await fetchReviews(selectedProduct.productID);
    } catch (err) {
      console.error('delete review error', err);
      setReviewsError(err.message || 'Error deleting review');
    }
  };

  const handleContactSeller = () => {
    if (selectedProduct?.sellerEmail) {
      window.location.href = `mailto:${selectedProduct.sellerEmail}?subject=Interested in ${selectedProduct.productName}`;
    }
    closeContactModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo"><i className="bi bi-lightning-charge-fill"></i> BOOSTS</div>
          <nav className="header-nav">
            <span className="user-greeting">
              <i class="bi bi-person-fill"></i> Welcome, {user?.firstname || 'Student'}
              {user?.role === 'SELLER' && (
                <span className="seller-badge"><i class="bi bi-check2"></i> Seller</span>
              )}
              {user?.role === 'ADMIN' && (
                <span className="admin-badge"><i className="bi bi-lightning-charge-fill"></i>ADMIN</span>
              )}
            </span>
            {user?.role === 'ADMIN' ? (
              <button className="nav-btn" onClick={() => navigate('/admin')}>
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
                  <span className="price">₱{product.price}</span>
                  <div className = "footer-buttons">
                    <button 
                      className="contact-btn-phone"
                      onClick={() => openContactModal(product)}
                    >
                      <i class="bi bi-telephone-fill"></i>
                    </button>
                    <button 
                      className="contact-btn"
                      onClick={() => openReviewsModal(product)}
                    >
                      View Reviews
                    </button>
                  </div>
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

      {/* Contact Seller Modal */}
      {isModalOpen && selectedProduct && (
        <div className="modal-overlay" onClick={closeContactModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeContactModal}>✕</button>
            
            <div className="modal-product-details">
              <img src={selectedProduct.image} alt={selectedProduct.productName} className="modal-product-image" />
              
              <div className="modal-info">
                <h2>{selectedProduct.productName}</h2>
                
                <div className="detail-row">
                  <label>Price:</label>
                  <span className="price">₱{selectedProduct.price}</span>
                </div>
                
                <div className="detail-row">
                  <label>Category:</label>
                  <span>{selectedProduct.category}</span>
                </div>
                
                <div className="detail-row">
                  <label>Status:</label>
                  <span>{selectedProduct.status}</span>
                </div>
                
                <div className="detail-row">
                  <label>Listed:</label>
                  <span>{selectedProduct.listedDate}</span>
                </div>
                
                <div className="detail-row full-width">
                  <label>Description:</label>
                  <p>{selectedProduct.description}</p>
                </div>
                
                <div className="seller-details">
                  <h3>Seller Contact Information</h3>
                  <div className="detail-row">
                    <label>Seller:</label>
                    <span>{selectedProduct.seller}</span>
                  </div>
                  <div className="detail-row">
                    <label>Email:</label>
                    <span>{selectedProduct.sellerEmail}</span>
                  </div>
                  <div className="detail-row">
                    <label>Phone:</label>
                    <span>{selectedProduct.sellerPhone}</span>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="btn-contact" onClick={handleContactSeller}>
                    <i className="bi bi-envelope"></i> Contact Seller
                  </button>
                  <button className="btn-cancel-contact" onClick={closeContactModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal (new) */}
      {isReviewsOpen && selectedProduct && (
        <div className="modal-overlay" onClick={closeReviewsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeReviewsModal}>✕</button>

            <div className="reviews-modal-body">
              <h2>Reviews for {selectedProduct.productName}</h2>

              {reviewsLoading ? (
                <p>Loading reviews...</p>
              ) : reviewsError ? (
                <div className="error-message">{reviewsError}</div>
              ) : (
                <div className="reviews-list">
                  {reviews.length === 0 && <p>No reviews yet. Be the first to review.</p>}
                  {reviews.map(r => (
                    <div key={r.recommendationID} className="review-item">
                      <div className="review-item-upper">
                        <div className="review-meta">
                          <div className="review-user"><strong>Author: </strong><span>{r.user ? `${r.user.firstname || r.user.username || 'User'}` : 'User'}</span></div>
                          <div className="review-date">{r.dateGenerated}</div>
                        </div>
                        <div className="review-rating"><strong>Rating:</strong> <span className="rating">{r.rating ?? '—'} <i class="bi bi-star-fill"></i></span></div>
                        
                      </div>

                      <div className = "review-item-lower">
                        <div className="review-message"><strong>Comment:</strong> <span>{r.message}</span></div>
                        {user && r.user && Number(r.user.userID) === Number(user.userID) && (
                          <button
                            type="button"
                            className="btn-delete-review"
                            onClick={() => handleDeleteReview(r.recommendationID)}
                          >
                            Delete
                          </button>
                        )}
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="review-form">
                <h3>Add your review</h3>
                <div className="form-row-review-upper">
                  <label>Rating&nbsp;</label>
                  <select value={newReviewRating} onChange={(e) => setNewReviewRating(Number(e.target.value))} className="review-select">
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </div>
                <div className="form-row-review">
                  <textarea
                    placeholder="Write your review..."
                    value={newReviewMessage}
                    onChange={(e) => setNewReviewMessage(e.target.value)}
                    rows={4}
                    className="review-textarea"
                  />
                </div>
                <div className="review-actions">
                  <button type="submit" className="btn-contact" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button type="button" className="btn-cancel-contact" onClick={closeReviewsModal}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}