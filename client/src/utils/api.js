const API_URL = "https://afyalinkbackend.onrender.com/api";

// Helper function to get headers with token
const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log("Response status:", response.status);
  console.log(
    "Response headers:",
    Object.fromEntries(response.headers.entries())
  );

  const data = await response.json();
  console.log("Response data:", data);

  if (!response.ok) {
    // Check if the response has an error message
    if (data.error) {
      throw new Error(data.error);
    }
    // Check if the response has a message
    if (data.message) {
      throw new Error(data.message);
    }
    // If no specific error message, use the status text
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
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
  try {
    const response = await fetch(`${API_URL}/doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Check if the response has an error message
      if (data.error) {
        throw new Error(data.error);
      }
      // Check if the response has a message
      if (data.message) {
        throw new Error(data.message);
      }
      // If no specific error message, use the status text
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Client API calls
export const getClients = async (token) => {
  console.log("Making request to get clients");
  console.log("Token being used:", token);
  console.log("Headers:", getHeaders(token));

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

export const unenrollClient = async (clientId, programId, token) => {
  const response = await fetch(
    `${API_URL}/enrollments/${clientId}/${programId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse(response);
};

export const logout = async (token) => {
  const response = await fetch(`${API_URL}/doctors/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};
