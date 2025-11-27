const API_BASE_URL = 'http://localhost:8080/api/users';

async function handleResponse(response) {
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!response.ok) {
    const msg = (data && data.error) ? data.error : (typeof data === 'string' ? data : 'Request failed');
    throw new Error(msg);
  }
  return data;
}

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const body = await handleResponse(res);
    throw new Error(body || 'Register failed');
  }
  return handleResponse(res);
};