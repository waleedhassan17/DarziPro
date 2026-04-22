// Customer Model - defines the expected shape and validation of customer data

export const CustomerModel = {
  id: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  notes: '',
  totalOrders: 0,
  totalSpent: 0,
  balanceDue: 0,
  measurements: [],
  createdAt: '',
  updatedAt: '',
};

export const validateCustomer = (data) => {
  return {
    id: data.id || data._id || data.customer_id || '',
    name: data.name || data.full_name || data.customer_name || 'Unknown',
    phone: data.phone || data.phone_number || data.mobile || '',
    email: data.email || data.email_address || '',
    address: data.address || data.street_address || '',
    city: data.city || data.location || '',
    notes: data.notes || data.remarks || '',
    totalOrders: data.totalOrders || data.total_orders || data.order_count || 0,
    totalSpent: data.totalSpent || data.total_spent || data.total_revenue || 0,
    balanceDue: data.balanceDue || data.balance_due || data.pending_amount || 0,
    measurements: Array.isArray(data.measurements) ? data.measurements : [],
    createdAt: data.createdAt || data.created_at || '',
    updatedAt: data.updatedAt || data.updated_at || '',
  };
};
