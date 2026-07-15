import api from "./api";

export const getAboutData = async () => {
  const response = await api.get("/about");
  return response.data;
};

export const updateAboutSection = async (sectionKey, data) => {
  const response = await api.put(`/about/update-section/${sectionKey}`, data);
  return response.data;
};

export const publishAbout = async (publishStatus = "Published") => {
  const response = await api.patch("/about/publish", { publishStatus });
  return response.data;
};
