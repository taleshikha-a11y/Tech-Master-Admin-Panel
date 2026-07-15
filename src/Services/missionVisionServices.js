import api from "./api";

export const getMissionVision = () =>
  api.get("/mission-vision");

export const createMissionVision = (data) =>
  api.post("/mission-vision", data);

export const updateHero = (data) =>
  api.put("/mission-vision/hero", data);

export const updateMission = (data) =>
  api.put("/mission-vision/mission", data);

export const updateVision = (data) =>
  api.put("/mission-vision/vision", data);

export const updateCTA = (data) =>
  api.put("/mission-vision/cta", data);

export const updateSEO = (data) =>
  api.put("/mission-vision/seo", data);

export const updateSectionField = (sectionKey, data) => 
  api.put(`/mission-vision/section/${sectionKey}`, data);

// Core Values
export const addCoreValue = (data) => api.post("/mission-vision/core-values", data);
export const updateCoreValue = (id, data) => api.put(`/mission-vision/core-values/${id}`, data);
export const deleteCoreValue = (id) => api.delete(`/mission-vision/core-values/${id}`);

// Brand Pillars
export const addBrandPillar = (data) => api.post("/mission-vision/brand-pillars", data);
export const updateBrandPillar = (id, data) => api.put(`/mission-vision/brand-pillars/${id}`, data);
export const deleteBrandPillar = (id) => api.delete(`/mission-vision/brand-pillars/${id}`);

// Roadmap
export const addRoadmap = (data) => api.post("/mission-vision/roadmap", data);
export const updateRoadmap = (id, data) => api.put(`/mission-vision/roadmap/${id}`, data);
export const deleteRoadmap = (id) => api.delete(`/mission-vision/roadmap/${id}`);