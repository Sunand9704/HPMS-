// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Token management
const TOKEN_KEY = 'hpms_patient_token';

export const tokenManager = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PatientRegistrationData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  password: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
  role: 'Doctor' | 'Patient';
}

export interface PatientRegistrationResponse {
  token: string;
  patient: {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    phone: string;
    status: string;
  };
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = tokenManager.getToken();
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && !options.skipAuth && { 'Authorization': `Bearer ${token}` }),
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Patient API functions
export const patientApi = {
  // Register a new patient (public endpoint)
  register: async (patientData: PatientRegistrationData): Promise<ApiResponse<PatientRegistrationResponse>> => {
    return apiRequest<PatientRegistrationResponse>('/patients/public/register', {
      method: 'POST',
      body: JSON.stringify(patientData),
      skipAuth: true
    });
  },

  // Login patient (public endpoint)
  login: async (loginData: { email: string; password: string }): Promise<ApiResponse<PatientRegistrationResponse>> => {
    return apiRequest<PatientRegistrationResponse>('/patients/public/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
      skipAuth: true
    });
  },

  // Get all patients (requires authentication)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    doctor?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Get patient by ID (requires authentication)
  getById: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/patients/${id}`, {
      method: 'GET',
    });
  },

  // Update patient (requires authentication)
  update: async (id: string, patientData: Partial<PatientRegistrationData>): Promise<ApiResponse> => {
    return apiRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  },

  // Delete patient (requires authentication)
  delete: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/patients/${id}`, {
      method: 'DELETE',
    });
  },

  // Get patient statistics (requires authentication)
  getStats: async (): Promise<ApiResponse> => {
    return apiRequest('/patients/stats', {
      method: 'GET',
    });
  },
};

// Auth API functions
export const authApi = {
  login: async (loginData: LoginData): Promise<ApiResponse> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },

  register: async (userData: any): Promise<ApiResponse> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async (): Promise<ApiResponse> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

// Doctor API functions (for future use)
export const doctorApi = {
  getAll: async (): Promise<ApiResponse> => {
    return apiRequest('/doctors', {
      method: 'GET',
    });
  },

  getById: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/doctors/${id}`, {
      method: 'GET',
    });
  },
};

// Appointment API functions
export const appointmentApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    doctor?: string;
    patient?: string;
    date?: string;
  }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  getByDoctor: async (doctorId: string, params?: {
    status?: string;
    date?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/appointments/doctor/${doctorId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  getById: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/appointments/${id}`, {
      method: 'GET',
    });
  },

  create: async (appointmentData: any): Promise<ApiResponse> => {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  update: async (id: string, appointmentData: any): Promise<ApiResponse> => {
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  },

  complete: async (id: string, completionData: {
    diagnosis?: string;
    prescription?: any[];
    vitalSigns?: any;
    notes?: string;
  }): Promise<ApiResponse> => {
    return apiRequest(`/appointments/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify(completionData),
    });
  },

  cancel: async (id: string, cancellationReason: string): Promise<ApiResponse> => {
    return apiRequest(`/appointments/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancellationReason }),
    });
  },

  getTodays: async (doctorId?: string): Promise<ApiResponse> => {
    const endpoint = doctorId ? `/appointments/today?doctor=${doctorId}` : '/appointments/today';
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  getStats: async (startDate?: string, endDate?: string): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const endpoint = `/appointments/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },
};

// Dashboard API functions (for future use)
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse> => {
    return apiRequest('/dashboard/stats', {
      method: 'GET',
    });
  },

  getRecentActivities: async (): Promise<ApiResponse> => {
    return apiRequest('/dashboard/activities', {
      method: 'GET',
    });
  },
};

// Export default API object
export default {
  patient: patientApi,
  auth: authApi,
  doctor: doctorApi,
  appointment: appointmentApi,
  dashboard: dashboardApi,
};
