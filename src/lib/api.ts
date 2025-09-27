import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8002/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  dummyLogin: async (username: string, password: string) => {
    const response = await api.post(`/auth/login/dummy?username=${username}&password=${password}`);
    return response.data;
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getDummyCredentials: async () => {
    const response = await api.get('/auth/dummy-credentials');
    return response.data;
  },
};

// Farmers API
export const farmersApi = {
  getFarmers: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status_filter?: string;
  }) => {
    const response = await api.get('/farmers', { params });
    return response.data;
  },

  getFarmer: async (farmerId: string) => {
    const response = await api.get(`/farmers/${farmerId}`);
    return response.data;
  },

  createFarmer: async (farmerData: {
    name: string;
    phone: string;
    email: string;
    location: string;
    national_id: string;
  }) => {
    const response = await api.post('/farmers/', farmerData);
    return response.data;
  },

  updateFarmer: async (farmerId: string, farmerData: Partial<{
    name: string;
    phone: string;
    email: string;
    location: string;
  }>) => {
    const response = await api.put(`/farmers/${farmerId}`, farmerData);
    return response.data;
  },

  updateKycStatus: async (farmerId: string, data: {
    kyc_status: string;
    rejected_reason?: string;
  }) => {
    const response = await api.patch(`/farmers/${farmerId}/kyc`, data);
    return response.data;
  },

  getFarmerCollections: async (farmerId: string, params?: {
    page?: number;
    size?: number;
  }) => {
    const response = await api.get(`/farmers/${farmerId}/collections`, { params });
    return response.data;
  },

  getFarmerPayments: async (farmerId: string, params?: {
    page?: number;
    size?: number;
  }) => {
    const response = await api.get(`/farmers/${farmerId}/payments`, { params });
    return response.data;
  },
};

// Collections API
export const collectionsApi = {
  getCollections: async (params?: {
    page?: number;
    size?: number;
    farmer_id?: string;
    staff_id?: string;
  }) => {
    const response = await api.get('/collections', { params });
    return response.data;
  },

  createCollection: async (collectionData: {
    farmer_id: string;
    staff_id: string;
    date: string;
    liters: number;
    temperature: number;
    fat_content: number;
    protein_content: number;
    latitude?: number;
    longitude?: number;
    timestamp?: string;
  }) => {
    const response = await api.post('/collections/', collectionData);
    return response.data;
  },

  createMobileCollection: async (collectionData: {
    farmer_id: string;
    date: string;
    liters: number;
    temperature: number;
    fat_content: number;
    protein_content: number;
    latitude?: number;
    longitude?: number;
    timestamp?: string;
  }) => {
    const response = await api.post('/collections/mobile', collectionData);
    return response.data;
  },

  createBulkCollections: async (collections: Array<{
    farmer_id: string;
    staff_id: string;
    date: string;
    liters: number;
    temperature: number;
    fat_content: number;
    protein_content: number;
    latitude?: number;
    longitude?: number;
    timestamp?: string;
  }>) => {
    const response = await api.post('/collections/bulk', collections);
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get('/analytics/admin/dashboard');
    return response.data;
  },

  getProductionTrends: async (days: number = 30) => {
    const response = await api.get('/analytics/production-trends', {
      params: { days },
    });
    return response.data;
  },

  getProductionForecast: async (daysAhead: number = 30) => {
    const response = await api.get('/analytics/production-forecast', {
      params: { days_ahead: daysAhead },
    });
    return response.data;
  },

  getFarmerRankings: async (periodDays: number = 30) => {
    const response = await api.get('/analytics/farmer-rankings', {
      params: { period_days: periodDays },
    });
    return response.data;
  },
};

// Payments API
export const paymentsApi = {
  getPayments: async (params?: {
    limit?: number;
    offset?: number;
    farmer_id?: string;
    status?: string;
  }) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  createPayment: async (paymentData: {
    farmer_id: string;
    period_month: string;
    total_liters: number;
    rate_per_liter: number;
    total_amount: number;
    payment_method: string;
    phone_number?: string;
    account_number?: string;
  }) => {
    const response = await api.post('/payments/', paymentData);
    return response.data;
  },

  getPayment: async (paymentId: string) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  updatePayment: async (paymentId: string, data: {
    status?: string;
    paid_at?: string;
  }) => {
    const response = await api.put(`/payments/${paymentId}`, data);
    return response.data;
  },

  getPaymentProjections: async (farmerId: string) => {
    const response = await api.get(`/payments/farmers/${farmerId}/projections`);
    return response.data;
  },
};

// Staff API
export const staffApi = {
  getStaff: async (params?: {
    page?: number;
    size?: number;
    role?: string;
    status?: string;
  }) => {
    const response = await api.get('/staff', { params });
    return response.data;
  },

  createStaff: async (staffData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role: string;
    phone: string;
  }) => {
    const response = await api.post('/staff/', staffData);
    return response.data;
  },

  getStaffMember: async (staffId: string) => {
    const response = await api.get(`/staff/${staffId}`);
    return response.data;
  },

  updateStaff: async (staffId: string, staffData: Partial<{
    username: string;
    email: string;
    full_name: string;
    role: string;
    phone: string;
    is_active: boolean;
  }>) => {
    const response = await api.put(`/staff/${staffId}`, staffData);
    return response.data;
  },

  getStaffPerformance: async (staffId: string) => {
    const response = await api.get(`/staff/${staffId}/performance`);
    return response.data;
  },
};

// Health API
export const healthApi = {
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;