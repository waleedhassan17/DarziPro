// Customer Serializer — maps raw API responses to match our model format
import { validateCustomer } from '../models/customerModel';

export const customerListSerializer = (rawResponse) => {
  const customers = rawResponse.data || rawResponse.customers || rawResponse.results || rawResponse;
  const list = Array.isArray(customers) ? customers : [];

  return {
    customers: list.map((item) => validateCustomer(item)),
    total: rawResponse.total || rawResponse.count || list.length,
    page: rawResponse.page || rawResponse.current_page || 1,
    totalPages: rawResponse.totalPages || rawResponse.total_pages || 1,
  };
};

export const customerDetailSerializer = (rawResponse) => {
  const customerData = rawResponse.data || rawResponse.customer || rawResponse;
  return validateCustomer(customerData);
};

export const customerCreateSerializer = (rawResponse) => {
  const customerData = rawResponse.data || rawResponse.customer || rawResponse;
  return validateCustomer(customerData);
};
