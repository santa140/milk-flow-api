// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role?: string;
  is_active: boolean;
  is_admin: boolean;
  portal?: string;
  created_at: string;
}

export interface LoginResponse {
  success?: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
  redirect_url?: string;
}

export interface DummyCredentials {
  [username: string]: {
    username: string;
    password: string;
    role: string;
    portal: string;
    full_name: string;
  };
}

// Farmer Types
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  kyc_status: string;
  card_issued: boolean;
  total_collections: number;
  total_volume: number;
  total_earnings: number;
  registered_at: string;
}

export interface FarmerFilters {
  page?: number;
  size?: number;
  search?: string;
  status_filter?: string;
}

export interface CreateFarmerRequest {
  name: string;
  phone: string;
  email: string;
  location: string;
  national_id: string;
}

// Collection Types
export interface Collection {
  id: string;
  farmer_id: string;
  staff_id: string;
  date: string;
  quantity_liters: number;
  quality_grade: string;
  price_per_liter: number;
  total_amount: number;
  timestamp: string;
}

export interface CreateCollectionRequest {
  farmer_id: string;
  staff_id?: string;
  date: string;
  liters: number;
  temperature: number;
  fat_content: number;
  protein_content: number;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
}

export interface CollectionFilters {
  page?: number;
  size?: number;
  farmer_id?: string;
  staff_id?: string;
}

// Payment Types
export interface Payment {
  id: string;
  farmer_id: string;
  period_month: string;
  total_liters: number;
  rate_per_liter: number;
  total_amount: number;
  status: string;
  paid_at?: string;
  tx_reference?: string;
  payment_method: string;
  phone_number?: string;
  account_number?: string;
  created_at: string;
}

export interface CreatePaymentRequest {
  farmer_id: string;
  period_month: string;
  total_liters: number;
  rate_per_liter: number;
  total_amount: number;
  payment_method: string;
  phone_number?: string;
  account_number?: string;
}

export interface PaymentProjection {
  farmer_id: string;
  projected_amount: number;
  period_month: string;
  total_liters: number;
  rate_per_liter: number;
  confidence: number;
  factors: string[];
}

// Analytics Types
export interface DashboardStats {
  total_farmers: number;
  active_collections: number;
  monthly_revenue: number;
  quality_distribution: {
    A: number;
    B: number;
    C: number;
  };
}

export interface AdminDashboardStats {
  farmer_stats: {
    total: number;
    active: number;
    pending_kyc: number;
  };
  collection_stats: {
    today: number;
    this_week: number;
    this_month: number;
    avg_quality: number;
  };
  payment_stats: {
    pending: number;
    completed: number;
    total_amount: number;
  };
  quality_metrics: {
    grade_a: number;
    grade_b: number;
    grade_c: number;
  };
  system_health: {
    database: string;
    cache: string;
    api: string;
  };
  last_updated: string;
}

export interface ProductionTrend {
  period: string;
  total_liters: number;
  avg_quality: number;
  farmer_count: number;
  collection_count: number;
}

export interface ProductionTrendsResponse {
  trends: ProductionTrend[];
  summary: {
    total_liters: number;
    avg_quality: number;
    active_farmers: number;
    total_collections: number;
    period_days: number;
  };
}

export interface ProductionForecast {
  predicted_liters: number;
  confidence: number;
  trend: string;
  predictions: Array<{
    date: string;
    predicted_liters: number;
    confidence: number;
    factors: string[];
  }>;
  accuracy_metrics: {
    mae: number;
    rmse: number;
  };
}

export interface FarmerRanking {
  farmer_id: string;
  name: string;
  total_liters: number;
  collection_count: number;
  avg_quality: number;
  avg_daily_liters: number;
  consistency: number;
  performance_score: number;
  rank: number;
  percentile: number;
  top_20_percent: boolean;
}

// Staff Types
export interface Staff {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStaffRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  phone: string;
}

export interface StaffPerformance {
  staff_id: string;
  collections_completed: number;
  total_liters_collected: number;
  avg_quality_score: number;
  on_time_completion_rate: number;
  customer_satisfaction: number;
  last_30_days: {
    collections: number;
    liters: number;
    routes_completed: number;
  };
}

// Route Types
export interface Route {
  id: string;
  staff_id: string;
  route_date: string;
  farmers: Array<{
    id: string;
    name: string;
    location: string;
    phone: string;
    expected_liters: number;
  }>;
  total_farmers: number;
  total_expected_liters: number;
  estimated_duration: number;
  created_at: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error_code?: string;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  error_code: string;
  message: string;
  timestamp: string;
}

// Quality Grade Types
export type QualityGrade = 'A' | 'B' | 'C';

// KYC Status Types
export type KycStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// Payment Status Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

// User Role Types
export type UserRole = 'admin' | 'staff' | 'farmer' | 'field_agent';

// Common Types
export interface SelectOption {
  value: string;
  label: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}