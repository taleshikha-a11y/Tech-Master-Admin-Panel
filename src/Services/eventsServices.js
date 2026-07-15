import api from "./api";

// MASTER EVENTS
export const getEvents = () => api.get("/events/events");
export const getEventById = (id) => api.get(`/events/events/${id}`);
export const createEvent = (data) => api.post("/events/events", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateEvent = (id, data) => api.put(`/events/events/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteEvent = (id) => api.delete(`/events/events/${id}`);

// WORKSHOPS
export const getWorkshops = () => api.get("/events/workshops");
export const createWorkshop = (data) => api.post("/events/workshops", data);
export const updateWorkshop = (id, data) => api.put(`/events/workshops/${id}`, data);
export const deleteWorkshop = (id) => api.delete(`/events/workshops/${id}`);

// CONFERENCES
export const getConferences = () => api.get("/events/conferences");
export const createConference = (data) => api.post("/events/conferences", data);
export const updateConference = (id, data) => api.put(`/events/conferences/${id}`, data);
export const deleteConference = (id) => api.delete(`/events/conferences/${id}`);

// BOOKING REQUESTS
export const getBookingRequests = () => api.get("/events/booking-requests");
export const createBookingRequest = (data) => api.post("/events/booking-requests", data);
export const updateBookingRequest = (id, data) => api.put(`/events/booking-requests/${id}`, data);
export const deleteBookingRequest = (id) => api.delete(`/events/booking-requests/${id}`);

// PAGE SETTINGS
export const getPageSettings = () => api.get("/events/page-settings");
export const updatePageSettings = (data) => api.put("/events/page-settings", data);

export const updateHeroSettings = (data) => api.put("/events/page-settings/hero", data);

export const addEngagementType = (data) => api.post("/events/page-settings/engagement-types", data);
export const updateEngagementType = (id, data) => api.put(`/events/page-settings/engagement-types/${id}`, data);
export const deleteEngagementType = (id) => api.delete(`/events/page-settings/engagement-types/${id}`);

export const addMediaArchive = (data) => api.post("/events/page-settings/media-archive", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateMediaArchive = (id, data) => api.put(`/events/page-settings/media-archive/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteMediaArchive = (id) => api.delete(`/events/page-settings/media-archive/${id}`);

export const updateVideoHighlights = (data) => api.put("/events/page-settings/video-highlights", data, { headers: { "Content-Type": "multipart/form-data" } });

export const updateBookingCTA = (data) => api.put("/events/page-settings/booking-cta", data);
