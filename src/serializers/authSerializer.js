// Auth Serializer — maps raw API responses to match our model format
import { validateUser } from '../models/authModel';

export const authLoginSerializer = (rawResponse) => {
  // Raw API might return different key names
  // Serializer maps them to our clean model format
  const userData = rawResponse.data || rawResponse.user || rawResponse;

  const cleanUser = validateUser({
    id: userData.user_id || userData.id || userData._id,
    name: userData.full_name || userData.name || userData.display_name,
    email: userData.email || userData.email_address,
    phone: userData.phone || userData.phone_number || userData.mobile,
    shopName: userData.shop_name || userData.shopName || userData.business_name,
    token: rawResponse.access_token || rawResponse.token || userData.token,
    refreshToken: rawResponse.refresh_token || rawResponse.refreshToken,
    avatar: userData.avatar || userData.profile_picture || userData.photo_url,
    role: userData.role || userData.user_role || 'tailor',
    language: userData.language || userData.preferred_language || 'en',
    createdAt: userData.created_at || userData.createdAt,
  });

  return cleanUser;
};

export const authRegisterSerializer = (rawResponse) => {
  const userData = rawResponse.data || rawResponse.user || rawResponse;

  const cleanUser = validateUser({
    id: userData.user_id || userData.id || userData._id,
    name: userData.full_name || userData.name,
    email: userData.email,
    phone: userData.phone || userData.phone_number,
    shopName: userData.shop_name || userData.shopName,
    token: rawResponse.access_token || rawResponse.token,
    refreshToken: rawResponse.refresh_token || rawResponse.refreshToken,
    avatar: userData.avatar || '',
    role: 'tailor',
    language: 'en',
    createdAt: userData.created_at || new Date().toISOString(),
  });

  return cleanUser;
};

export const authProfileSerializer = (rawResponse) => {
  const userData = rawResponse.data || rawResponse;

  return validateUser({
    id: userData.user_id || userData.id,
    name: userData.full_name || userData.name,
    email: userData.email,
    phone: userData.phone || userData.phone_number,
    shopName: userData.shop_name || userData.shopName,
    token: '', // profile endpoint doesn't return token
    avatar: userData.avatar || userData.profile_picture,
    role: userData.role,
    language: userData.language,
    createdAt: userData.created_at,
  });
};
