// API Configuration
export const API_BASE_URL = 'https://api.darzipro.com'; // Replace with actual URL

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@DarziPro:authToken',
  USER_DATA: '@DarziPro:userData',
  LANGUAGE: '@DarziPro:language',
  ONBOARDED: '@DarziPro:onboarded',
  REMEMBER_ME: '@DarziPro:rememberMe',
};

// Garment Types (Pakistani Attire)
export const GARMENT_TYPES = {
  SHALWAR_KAMEEZ_MEN: 'Shalwar Kameez (Men)',
  SHALWAR_KAMEEZ_WOMEN: 'Shalwar Kameez (Women)',
  KURTA_MEN: 'Kurta (Men)',
  KURTA_WOMEN: 'Kurta (Women)',
  WAISTCOAT: 'Waistcoat / Sadri',
  SHERWANI: 'Sherwani',
  TROUSER: 'Trouser',
  SHIRT: 'Shirt',
  PANT: 'Pant',
  BLOUSE: 'Blouse',
  LEHNGA: 'Lehnga',
  GHARARA: 'Gharara',
  SHARARA: 'Sharara',
  DUPATTA: 'Dupatta',
  ABAYA: 'Abaya',
  CUSTOM: 'Custom',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CUTTING: 'cutting',
  STITCHING: 'stitching',
  FINISHING: 'finishing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

// Languages
export const LANGUAGES = {
  EN: 'en',
  UR: 'ur',
};
