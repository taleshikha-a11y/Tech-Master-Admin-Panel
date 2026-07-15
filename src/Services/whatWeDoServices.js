import api from './api';

export const getWhatWeDo = async () => {
  const response = await api.get('/what-we-do');
  return response.data;
};

export const updateHero = async (data) => {
  const response = await api.put('/what-we-do/hero', data);
  return response.data;
};

export const createOperation = async (data) => {
  const response = await api.post('/what-we-do/operations', data);
  return response.data;
};

export const updateOperation = async (id, data) => {
  const response = await api.put(`/what-we-do/operations/${id}`, data);
  return response.data;
};

export const deleteOperation = async (id) => {
  const response = await api.delete(`/what-we-do/operations/${id}`);
  return response.data;
};

export const toggleOperationStatus = async (id) => {
  const response = await api.patch(`/what-we-do/operations/${id}/toggle`);
  return response.data;
};

export const reorderOperations = async (operations) => {
  const response = await api.patch('/what-we-do/operations/reorder', { operations });
  return response.data;
};

export const createServiceItem = async (data) => {
  const response = await api.post('/what-we-do/services', data);
  return response.data;
};

export const updateServiceItem = async (id, data) => {
  const response = await api.put(`/what-we-do/services/${id}`, data);
  return response.data;
};

export const deleteServiceItem = async (id) => {
  const response = await api.delete(`/what-we-do/services/${id}`);
  return response.data;
};

export const toggleServiceStatus = async (id) => {
  const response = await api.patch(`/what-we-do/services/${id}/toggle`);
  return response.data;
};

export const reorderServices = async (services) => {
  const response = await api.patch('/what-we-do/services/reorder', { services });
  return response.data;
};

export const updateQuoteBanner = async (data) => {
  const response = await api.put('/what-we-do/quote-banner', data);
  return response.data;
};

export const updateSeo = async (data) => {
  const formData = new FormData();
  for (const key in data) {
    if(key === 'ogImageUrl' && data[key] instanceof File) {
       formData.append('ogImageUrl', data[key]);
    } else {
       formData.append(key, data[key] || '');
    }
  }
  const response = await api.put('/what-we-do/seo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateSectionSettings = async (data) => {
  const response = await api.put('/what-we-do/section-settings', data);
  return response.data;
};

export const publishWhatWeDo = async () => {
  const response = await api.put('/what-we-do/publish');
  return response.data;
};

export const draftWhatWeDo = async () => {
  const response = await api.put('/what-we-do/draft');
  return response.data;
};
