// Centralized API configuration for HPMS Admin Panel
const API_BASE_URL = 'http://localhost:8000/api';

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// API Error interface
interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('hpms_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Authentication API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, role: 'Admin' }),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  getProfile: () =>
    apiRequest('/auth/profile'),

  updateProfile: (data: any) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    }),

  refreshToken: () =>
    apiRequest('/auth/refresh', {
      method: 'POST',
    }),
};

// Patient API
export const patientAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    doctor?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest(`/patients${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest(`/patients/${id}`),

  create: (data: any) =>
    apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/patients/${id}`, {
      method: 'DELETE',
    }),

  getStats: () =>
    apiRequest('/patients/stats'),
};

// Doctor API
export const doctorAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    specialty?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest(`/doctors${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest(`/doctors/${id}`),

  create: (data: any) =>
    apiRequest('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateRating: (id: string, rating: number) =>
    apiRequest(`/doctors/${id}/rating`, {
      method: 'PUT',
      body: JSON.stringify({ rating }),
    }),

  delete: (id: string) =>
    apiRequest(`/doctors/${id}`, {
      method: 'DELETE',
    }),

  getStats: () =>
    apiRequest('/doctors/stats'),
};

// Appointment API
export const appointmentAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    doctor?: string;
    patient?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest(`/appointments${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest(`/appointments/${id}`),

  create: (data: any) =>
    apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancel: (id: string, reason: string) =>
    apiRequest(`/appointments/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancellationReason: reason }),
    }),

  complete: (id: string, data: any) =>
    apiRequest(`/appointments/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getToday: (doctor?: string) => {
    const query = doctor ? `?doctor=${doctor}` : '';
    return apiRequest(`/appointments/today${query}`);
  },

  getStats: (params?: { startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest(`/appointments/stats${query ? `?${query}` : ''}`);
  },
};

// User API
export const userAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    department?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest(`/users${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest(`/users/${id}`),

  create: (data: any) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: 'Active' | 'Inactive' | 'Suspended') =>
    apiRequest(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  changePassword: (id: string, newPassword: string) =>
    apiRequest(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    }),

  delete: (id: string) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),

  getStats: () =>
    apiRequest('/users/stats'),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () =>
    apiRequest('/dashboard/overview'),

  getPatientGrowth: (months?: number) => {
    const query = months ? `?months=${months}` : '';
    return apiRequest(`/dashboard/patient-growth${query}`);
  },

  getAppointmentAnalytics: (params?: { startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest(`/dashboard/appointment-analytics${query ? `?${query}` : ''}`);
  },

  getDoctorPerformance: () =>
    apiRequest('/dashboard/doctor-performance'),

  getAlerts: () =>
    apiRequest('/dashboard/alerts'),

  getActivities: (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest(`/dashboard/activities${query}`);
  },
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('hpms_token');
    return !!token;
  },

  // Set authentication token
  setToken: (token: string) => {
    localStorage.setItem('hpms_token', token);
  },

  // Remove authentication token
  removeToken: () => {
    localStorage.removeItem('hpms_token');
  },

  // Get authentication token
  getToken: () => {
    return localStorage.getItem('hpms_token');
  },

  // Handle API errors consistently
  handleError: (error: any) => {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: error.message || 'Unknown error'
    };
  },
};

// Export types for use in components
export type { ApiResponse, ApiError };

// Export the base URL for external use
export { API_BASE_URL };
