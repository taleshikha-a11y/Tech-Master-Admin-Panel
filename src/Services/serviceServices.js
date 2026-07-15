import api from "./api";

// Main
export const getServiceData = () => api.get("/services");
export const createService = (data) => api.post("/services", data);

// Hero
export const updateHero = (data) => api.put("/services/hero", data);

// Categories
export const addCategory = (data) => api.post("/services/categories", data);
export const updateCategory = (id, data) => api.put(`/services/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/services/categories/${id}`);

// Cards
export const addCard = (data) => api.post("/services/cards", data);
export const updateCard = (id, data) => api.put(`/services/cards/${id}`, data);
export const deleteCard = (id) => api.delete(`/services/cards/${id}`);

// Features
export const addFeature = (data) => api.post("/services/features", data);
export const updateFeature = (id, data) => api.put(`/services/features/${id}`, data);
export const deleteFeature = (id) => api.delete(`/services/features/${id}`);

// Process
export const addProcess = (data) => api.post("/services/process", data);
export const updateProcess = (id, data) => api.put(`/services/process/${id}`, data);
export const deleteProcess = (id) => api.delete(`/services/process/${id}`);

// Technologies
export const addTechnology = (data) => api.post("/services/technologies", data);
export const updateTechnology = (id, data) => api.put(`/services/technologies/${id}`, data);
export const deleteTechnology = (id) => api.delete(`/services/technologies/${id}`);

// Why Choose Us
export const addWhyChooseUs = (data) => api.post("/services/why-choose-us", data);
export const updateWhyChooseUs = (id, data) => api.put(`/services/why-choose-us/${id}`, data);
export const deleteWhyChooseUs = (id) => api.delete(`/services/why-choose-us/${id}`);

// Statistics
export const addStatistic = (data) => api.post("/services/statistics", data);
export const updateStatistic = (id, data) => api.put(`/services/statistics/${id}`, data);
export const deleteStatistic = (id) => api.delete(`/services/statistics/${id}`);

// Pricing Plans
export const addPricingPlan = (data) => api.post("/services/pricing", data);
export const updatePricingPlan = (id, data) => api.put(`/services/pricing/${id}`, data);
export const deletePricingPlan = (id) => api.delete(`/services/pricing/${id}`);

// FAQs
export const addFaq = (data) => api.post("/services/faqs", data);
export const updateFaq = (id, data) => api.put(`/services/faqs/${id}`, data);
export const deleteFaq = (id) => api.delete(`/services/faqs/${id}`);

// CTA
export const updateCTA = (data) => api.put("/services/cta", data);

// SEO
export const updateSEO = (data) => api.put("/services/seo", data);

export const updateEntireService = (data) => api.put('/services', data);
