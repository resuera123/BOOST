const API_BASE_URL = 'http://localhost:8080/seller-applications';  // Changed from sellerApplications

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

// Create seller application
export const createSellerApplication = async (applicationData) => {
  const res = await fetch(`${API_BASE_URL}/createSellerApplication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData),
  });
  return handleResponse(res);
};

// Get all applications (for admin)
export const getAllSellerApplications = async () => {
  const res = await fetch(`${API_BASE_URL}/getAllApplications`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
};

// Get application by ID
export const getSellerApplicationById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/getApplicationById/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
};