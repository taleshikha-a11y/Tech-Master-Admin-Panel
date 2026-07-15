import api from './api';

export const getCollaboration = () => api.get('/collaboration');

// Hero
export const updateHero = (data) => api.put('/collaboration/hero', data);

// History
export const updateHistory = (data) => api.put('/collaboration/history', data);

// SEO
export const updateSeo = (data) => api.put('/collaboration/seo', data);

// Section Settings
export const updateSectionSettings = (data) => api.put('/collaboration/settings', data);

// Brands
export const addBrand = (data) => api.post('/collaboration/brands', data);
export const updateBrand = (id, data) => api.put(`/collaboration/brands/${id}`, data);
export const deleteBrand = (id) => api.delete(`/collaboration/brands/${id}`);

// Partners
export const addPartner = (data) => api.post('/collaboration/partners', data);
export const updatePartner = (id, data) => api.put(`/collaboration/partners/${id}`, data);
export const deletePartner = (id) => api.delete(`/collaboration/partners/${id}`);

// Metrics
export const addMetric = (data) => api.post('/collaboration/metrics', data);
export const updateMetric = (id, data) => api.put(`/collaboration/metrics/${id}`, data);
export const deleteMetric = (id) => api.delete(`/collaboration/metrics/${id}`);

// Campaigns
export const addCampaign = (data) => api.post('/collaboration/campaigns', data);
export const updateCampaign = (id, data) => api.put(`/collaboration/campaigns/${id}`, data);
export const deleteCampaign = (id) => api.delete(`/collaboration/campaigns/${id}`);

// Process
export const addProcess = (data) => api.post('/collaboration/process', data);
export const updateProcess = (id, data) => api.put(`/collaboration/process/${id}`, data);
export const deleteProcess = (id) => api.delete(`/collaboration/process/${id}`);

// Testimonials
export const addTestimonial = (data) => api.post('/collaboration/testimonials', data);
export const updateTestimonial = (id, data) => api.put(`/collaboration/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/collaboration/testimonials/${id}`);
