const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const productService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    return data;
  },

  create: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    return data;
  }
};

export const orderService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/orders`);
    const data = await response.json();
    return data;
  },

  create: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    return data;
  }
};
