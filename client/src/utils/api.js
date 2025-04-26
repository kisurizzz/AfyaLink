const API_URL = "http://127.0.0.1:5000/api";

// Helper function to get headers with token
const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};

// Auth API calls
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/doctors/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  // Handle the specific response format from your backend
  if (data.message === "Login successful" && data.data && data.data.token) {
    return {
      token: data.data.token,
      user: data.data.user,
    };
  }

  throw new Error("Invalid response format from server");
};

export const signup = async (username, password, email) => {
  const response = await fetch(`${API_URL}/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  });

  return handleResponse(response);
};

// Client API calls
export const getClients = async (token) => {
  const response = await fetch(`${API_URL}/clients`, {
    method: "GET",
    headers: getHeaders(token),
  });

  return handleResponse(response);
};

export const getClientById = async (clientId, token) => {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "GET",
    headers: getHeaders(token),
  });

  return handleResponse(response);
};

export const createClient = async (clientData, token) => {
  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(clientData),
  });

  return handleResponse(response);
};

export const updateClient = async (clientId, clientData, token) => {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(clientData),
  });

  return handleResponse(response);
};

export const deleteClient = async (clientId, token) => {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  return handleResponse(response);
};

// Program API calls
export const getPrograms = async (token) => {
  const response = await fetch(`${API_URL}/programs`, {
    method: "GET",
    headers: getHeaders(token),
  });

  return handleResponse(response);
};

export const getProgramById = async (programId, token) => {
  const response = await fetch(`${API_URL}/programs/${programId}`, {
    method: "GET",
    headers: getHeaders(token),
  });

  return handleResponse(response);
};

export const createProgram = async (programData, token) => {
  const response = await fetch(`${API_URL}/programs`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(programData),
  });

  return handleResponse(response);
};

export const updateProgram = async (programId, programData, token) => {
  const response = await fetch(`${API_URL}/programs/${programId}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(programData),
  });

  return handleResponse(response);
};

export const deleteProgram = async (programId, token) => {
  const response = await fetch(`${API_URL}/programs/${programId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  return handleResponse(response);
};

// Enrollment API calls
export const getEnrollments = async (token) => {
  const response = await fetch(`${API_URL}/enrollments`, {
    method: "GET",
    headers: getHeaders(token),
  });

  return handleResponse(response);
};

export const createEnrollment = async (enrollmentData, token) => {
  const response = await fetch(`${API_URL}/enrollments`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(enrollmentData),
  });

  return handleResponse(response);
};

export const deleteEnrollment = async (clientId, programId, token) => {
  const response = await fetch(
    `${API_URL}/enrollments/${clientId}/${programId}`,
    {
      method: "DELETE",
      headers: getHeaders(token),
    }
  );

  return handleResponse(response);
};
