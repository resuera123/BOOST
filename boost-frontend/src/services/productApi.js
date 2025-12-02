const API_BASE_URL = 'http://localhost:8080/products';

async function handleResponse(response) {
  const text = await response.text();
  let data;
  try { 
    data = JSON.parse(text); 
  } catch { 
    data = text; 
  }
  if (!response.ok) {
    const msg = (data && data.error) ? data.error : (typeof data === 'string' ? data : 'Request failed');
    throw new Error(msg);
  }
  return data;
}

// CREATE - Add new product
export const createProduct = async (productData) => {
  const res = await fetch(`${API_BASE_URL}/createProduct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

// READ - Get all products
export const getAllProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/getAllProducts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
};

// READ - Get product by ID
export const getProductById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/getProductById/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
};

// UPDATE - Update existing product
export const updateProduct = async (id, productData) => {
  const res = await fetch(`${API_BASE_URL}/updateProduct/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

// DELETE - Delete product
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/deleteProduct/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
};

// READ - Get products by user ID
export const getProductsByUser = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/getProductsByUser/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
};