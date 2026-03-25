

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, '').replace('+91', ''));
};

export const validateProductForm = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters long';
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }
  
  if (!data.priceRange || data.priceRange.trim().length === 0) {
    errors.priceRange = 'Price is required';
  }
  
  if (!data.category) {
    errors.category = 'Please select a product category';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSaleForm = (data) => {
  const errors = {};
  
  if (!data.product_id) {
    errors.product_id = 'Please select a product';
  }
  
  if (!data.quantity || Number(data.quantity) <= 0) {
    errors.quantity = 'Quantity must be at least 1';
  }
  
  if (!data.amount || Number(data.amount) <= 0) {
    errors.amount = 'Sale amount must be a positive number';
  }
  
  if (!data.customer_name || data.customer_name.trim().length < 2) {
    errors.customer_name = 'Customer name is required';
  }
  
  if (!data.sale_date) {
    errors.sale_date = 'Sale date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateQuoteForm = (formData) => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    }
    // Company details and Address technically optional for simple inquiries but good to have
    // Requirements are explicitly OPTIONAL now
    
    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
};
