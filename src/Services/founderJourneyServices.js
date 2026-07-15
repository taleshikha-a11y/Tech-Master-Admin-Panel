import api from './api';

export const getFounderJourneyItems = async () => {
    const response = await api.get('/founderJourney/items');
    return response.data;
};

export const getFounderJourneySettings = async () => {
    const response = await api.get('/founderJourney/settings');
    return response.data;
};

export const createFounderJourneyItem = async (data) => {
    const response = await api.post('/founderJourney/items', data);
    return response.data;
};

export const updateFounderJourneyItem = async (id, data) => {
    const response = await api.put(`/founderJourney/items/${id}`, data);
    return response.data;
};

export const deleteFounderJourneyItem = async (id) => {
    const response = await api.delete(`/founderJourney/items/${id}`);
    return response.data;
};

export const toggleFounderJourneyItemStatus = async (id) => {
    const response = await api.patch(`/founderJourney/items/${id}/status`);
    return response.data;
};

export const reorderFounderJourneyItems = async (items) => {
    const response = await api.patch('/founderJourney/items/reorder', { items });
    return response.data;
};

export const updateFounderJourneySettings = async (data) => {
    const response = await api.put('/founderJourney/settings', data);
    return response.data;
};

export const publishFounderJourneyLive = async () => {
    const response = await api.post('/founderJourney/settings/publish');
    return response.data;
};

export const uploadFounderJourneyMedia = async (id, formData) => {
    const response = await api.post(`/founderJourney/items/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
