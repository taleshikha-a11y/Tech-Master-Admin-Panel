import api from './api';

// ----------------------------------------
// CAMPAIGN SERVICES (/api/v1/campaigns)
// ----------------------------------------

export const getCampaignHero = () => api.get('/campaigns/hero').then(res => res.data);
export const updateCampaignHero = (data) => api.put('/campaigns/hero', data).then(res => res.data);

export const getCampaignLifecycle = () => api.get('/campaigns/lifecycle').then(res => res.data);
export const createCampaignLifecycle = (data) => api.post('/campaigns/lifecycle', data).then(res => res.data);
export const updateCampaignLifecycle = (id, data) => api.put(`/campaigns/lifecycle/${id}`, data).then(res => res.data);
export const deleteCampaignLifecycle = (id) => api.delete(`/campaigns/lifecycle/${id}`).then(res => res.data);

export const getCampaignSuccessStories = () => api.get('/campaigns/success-stories').then(res => res.data);
export const createCampaignSuccessStory = (data) => api.post('/campaigns/success-stories', data).then(res => res.data);
export const updateCampaignSuccessStory = (id, data) => api.put(`/campaigns/success-stories/${id}`, data).then(res => res.data);
export const deleteCampaignSuccessStory = (id) => api.delete(`/campaigns/success-stories/${id}`).then(res => res.data);

export const getCampaignSeo = () => api.get('/campaigns/seo').then(res => res.data);
export const updateCampaignSeo = (data) => api.put('/campaigns/seo', data).then(res => res.data);

export const getCampaignsList = () => api.get('/campaigns/').then(res => res.data);
export const createCampaignItem = (data) => api.post('/campaigns/', data).then(res => res.data);
export const updateCampaignItem = (id, data) => api.put(`/campaigns/${id}`, data).then(res => res.data);
export const deleteCampaignItem = (id) => api.delete(`/campaigns/${id}`).then(res => res.data);

// ----------------------------------------
// LAUNCH SERVICES (/api/v1/launches)
// ----------------------------------------

export const getLaunchHero = () => api.get('/launches/hero').then(res => res.data);
export const updateLaunchHero = (data) => api.put('/launches/hero', data).then(res => res.data);

export const getLaunchVideo = () => api.get('/launches/video').then(res => res.data);
export const updateLaunchVideo = (data) => api.put('/launches/video', data).then(res => res.data);

export const getLaunchInitiatives = () => api.get('/launches/initiatives').then(res => res.data);
export const createLaunchInitiative = (data) => api.post('/launches/initiatives', data).then(res => res.data);
export const updateLaunchInitiative = (id, data) => api.put(`/launches/initiatives/${id}`, data).then(res => res.data);
export const deleteLaunchInitiative = (id) => api.delete(`/launches/initiatives/${id}`).then(res => res.data);

export const getLaunchSeo = () => api.get('/launches/seo').then(res => res.data);
export const updateLaunchSeo = (data) => api.put('/launches/seo', data).then(res => res.data);

export const getLaunchProducts = () => api.get('/launches/products').then(res => res.data);
export const createLaunchProduct = (data) => api.post('/launches/products', data).then(res => res.data);
export const updateLaunchProduct = (id, data) => api.put(`/launches/products/${id}`, data).then(res => res.data);
export const deleteLaunchProduct = (id) => api.delete(`/launches/products/${id}`).then(res => res.data);
