// Force Vite cache invalidation
import api from "./api";

export const getCareers = async () => {
  const response = await api.get("/career");
  return response.data;
};

export const getCareerById = async (id) => {
  const response = await api.get(`/career/${id}`);
  return response.data;
};

export const createCareer = async (data) => {
  // If it contains a file (companyLogo), it should be FormData
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  }

  const response = await api.post("/career/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCareer = async (id, data) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  }

  const response = await api.put(`/career/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCareer = async (id) => {
  const response = await api.delete(`/career/${id}`);
  return response.data;
};

export const getCareerSettings = () => api.get('/career/settings');
export const updateCareerSettings = (data) => api.put('/career/settings', data);

export const getResumes = async () => {
  const response = await api.get("/resume");
  return response.data;
};

export const updateResume = async (id, data) => {
  const response = await api.put(`/resume/${id}`, data);
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await api.delete(`/resume/${id}`);
  return response.data;
};
