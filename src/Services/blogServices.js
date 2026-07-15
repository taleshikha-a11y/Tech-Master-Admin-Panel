import api from "./api";

// Blog Settings
export const getBlogSettings = () => api.get("/blogs/settings");
export const updateBlogSettings = (data) => api.put("/blogs/settings", data);

// Blogs
export const getBlogs = () => api.get("/blogs");
export const createBlog = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  }
  return api.post("/blogs/create", formData, { headers: { "Content-Type": "multipart/form-data" } });
};

export const updateBlog = (id, data) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  }
  return api.put(`/blogs/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
};

export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
