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
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = tokenManager.getToken();
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
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

// Appointment API functions (for future use)
export const appointmentApi = {
  getAll: async (): Promise<ApiResponse> => {
    return apiRequest('/appointments', {
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

  delete: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
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
