// Auth Model - defines the expected shape and validation of auth responses

export const UserModel = {
  id: '',
  name: '',
  email: '',
  phone: '',
  shopName: '',
  token: '',
  refreshToken: '',
  avatar: '',
  role: 'tailor', // tailor | admin | worker
  language: 'en',
  createdAt: '',
};

export const validateUser = (data) => {
  return {
    id: data.id || '',
    name: data.name || 'Unknown',
    email: data.email || '',
    phone: data.phone || '',
    shopName: data.shopName || '',
    token: data.token || '',
    refreshToken: data.refreshToken || '',
    avatar: data.avatar || '',
    role: data.role || 'tailor',
    language: data.language || 'en',
    createdAt: data.createdAt || new Date().toISOString(),
  };
};

export const LoginResponseModel = {
  user: UserModel,
  token: '',
  refreshToken: '',
  message: '',
};

export const RegisterResponseModel = {
  user: UserModel,
  token: '',
  message: '',
};
