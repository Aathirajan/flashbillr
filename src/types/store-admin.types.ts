export interface CreateStoreAdminDto {
  email: string;
  name: string;
  storeId: string;
  role?: 'ADMIN' | 'MANAGER' | 'STAFF';
}

export interface UpdateStoreAdminDto {
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'MANAGER' | 'STAFF';
}

export interface SetupPasswordDto {
  token: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
  storeId?: string; // Optional for store admins, required for other roles
}

export interface AuthResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    storeId: string;
  };
}

export interface StoreAdmin {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  storeId: string;
  createdAt?: string;
  status?: 'active' | 'pending' | 'inactive';
}

export interface StoreAdminResponse {
  success: boolean;
  message: string;
  data: StoreAdmin;
}

export interface StoreAdminListResponse {
  success: boolean;
  data: StoreAdmin[];
}
