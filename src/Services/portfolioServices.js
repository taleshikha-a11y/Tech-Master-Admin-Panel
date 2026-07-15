import api from "./api";

export const getPortfolios = () => api.get("/portfolio");

export const getPortfolioById = (id) => api.get(`/portfolio/${id}`);

export const createPortfolio = (data) => api.post("/portfolio/create", data);

export const updatePortfolio = (id, data) => api.put(`/portfolio/${id}`, data);

export const deletePortfolio = (id) => api.delete(`/portfolio/${id}`);

export const getPortfolioSettings = () => api.get('/portfolio/settings');
export const updatePortfolioSettings = (data) => api.put('/portfolio/settings', data);
