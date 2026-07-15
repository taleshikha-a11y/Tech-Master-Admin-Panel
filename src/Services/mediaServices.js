import axios from 'axios';

// Replace with your actual backend URL or use environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

export const createMedia = async (formData) => {
  const response = await axios.post(`${API_URL}/media/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMedia = async () => {
  const response = await axios.get(`${API_URL}/media`);
  return response.data;
};

export const getMediaById = async (id) => {
  const response = await axios.get(`${API_URL}/media/${id}`);
  return response.data;
};

export const updateMedia = async (id, formData) => {
  const response = await axios.put(`${API_URL}/media/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteMedia = async (id) => {
  const response = await axios.delete(`${API_URL}/media/${id}`);
  return response.data;
};
