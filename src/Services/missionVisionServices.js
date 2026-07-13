import api from "./api";

export const getMissionVision = () =>
  api.get("/missionvision");

export const createMissionVision = (data) =>
  api.post("/missionvision", data);

export const updateHero = (data) =>
  api.put("/missionvision/hero", data);

export const updateMission = (data) =>
  api.put("/missionvision/mission", data);

export const updateVision = (data) =>
  api.put("/missionvision/vision", data);

export const addCoreValue = (data) =>
  api.post("/missionvision/core-values", data);

export const updateCoreValue = (id, data) =>
  api.put(`/missionvision/core-values/${id}`, data);

export const deleteCoreValue = (id) =>
  api.delete(`/missionvision/core-values/${id}`);

export const addBrandPillar = (data) =>
  api.post("/missionvision/brand-pillars", data);

export const addRoadmap = (data) =>
  api.post("/missionvision/roadmap", data);

export const updateCTA = (data) =>
  api.put("/missionvision/cta", data);

export const updateSEO = (data) =>
  api.put("/missionvision/seo", data);

export const saveDraft = () =>
  api.patch("/missionvision/draft");

export const publish = () =>
  api.patch("/missionvision/publish");