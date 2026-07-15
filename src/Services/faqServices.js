import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/faq`;

export const getFaqs = async () => {
    const response = await axios.get(`${API_URL}/`);
    return response.data.data;
};

export const createFaq = async (data) => {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data.data;
};

export const updateFaq = async (id, data) => {
    const response = await axios.put(`${API_URL}/update/${id}`, data);
    return response.data.data;
};

export const deleteFaq = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data.data;
};

export const getEnquiries = async () => {
    const response = await axios.get(`${API_URL}/enquiries`);
    return response.data.data;
};

export const createEnquiry = async (data) => {
    const response = await axios.post(`${API_URL}/enquiries/create`, data);
    return response.data.data;
};

export const updateEnquiry = async (id, data) => {
    const response = await axios.put(`${API_URL}/enquiries/update/${id}`, data);
    return response.data.data;
};

export const deleteEnquiry = async (id) => {
    const response = await axios.delete(`${API_URL}/enquiries/delete/${id}`);
    return response.data.data;
};
