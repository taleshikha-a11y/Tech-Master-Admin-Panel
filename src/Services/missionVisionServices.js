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