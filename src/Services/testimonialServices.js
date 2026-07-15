import axios from "axios";

// Make sure to use the environment variable for your API URL if applicable
const API_URL = `${import.meta.env.VITE_API_URL}/api/testimonials`; 

// Create an Axios instance with credentials if needed (e.g., for JWT cookies)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getTestimonials = () => api.get("/");

export const getTestimonialById = (id) => api.get(`/${id}`);

export const createTestimonial = (formData) => {
  return api.post("/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateTestimonial = (id, formData) => {
  return api.put(`/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteTestimonial = (id) => api.delete(`/${id}`);
