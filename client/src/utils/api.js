const API_URL = "http://127.0.0.1:5000/api";

// Helper function to get headers with token
const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Auth API calls
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/doctors/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const signup = async (username, password, email) => {
  const response = await fetch(`${API_URL}/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  });
  return response.json();
};

// Client API calls
export const getClients = async (token) => {
  const response = await fetch(`${API_URL}/clients/search`, {
    headers: getHeaders(token),
  });
  return response.json();
};

export const getClientById = async (clientId, token) => {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    headers: getHeaders(token),
  });
  return response.json();
};

export const createClient = async (clientData, token) => {
  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(clientData),
  });
  return response.json();
};

export const updateClient = async (clientId, clientData, token) => {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(clientData),
  });
  return response.json();
};

export const deleteClient = async (clientId, token) => {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  return response.json();
};

// Program API calls
export const getPrograms = async (token) => {
  const response = await fetch(`${API_URL}/programs`, {
    headers: getHeaders(token),
  });
  return response.json();
};

export const getProgramById = async (programId, token) => {
  const response = await fetch(`${API_URL}/programs/${programId}`, {
    headers: getHeaders(token),
  });
  return response.json();
};

export const createProgram = async (programData, token) => {
  const response = await fetch(`${API_URL}/programs`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(programData),
  });
  return response.json();
};

export const updateProgram = async (programId, programData, token) => {
  const response = await fetch(`${API_URL}/programs/${programId}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(programData),
  });
  return response.json();
};

export const deleteProgram = async (programId, token) => {
  const response = await fetch(`${API_URL}/programs/${programId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  return response.json();
};

// Enrollment API calls
export const getEnrollments = async (token) => {
  const response = await fetch(`${API_URL}/enrollments`, {
    headers: getHeaders(token),
  });
  return response.json();
};

export const createEnrollment = async (enrollmentData, token) => {
  const response = await fetch(`${API_URL}/enrollments`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(enrollmentData),
  });
  return response.json();
};

export const deleteEnrollment = async (clientId, programId, token) => {
  const response = await fetch(
    `${API_URL}/enrollments/${clientId}/${programId}`,
    {
      method: "DELETE",
      headers: getHeaders(token),
    }
  );
  return response.json();
};
