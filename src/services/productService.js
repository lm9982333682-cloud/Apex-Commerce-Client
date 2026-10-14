
import api from "./api";

export const getAllProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();

  formData.append("title", productData.title);
  formData.append("description", productData.description);
  formData.append("price", String(productData.price));
  formData.append("category", productData.category);
  formData.append("status", productData.status);
  formData.append("stock", String(productData.stock));

  // Send selected sizes as an array in JSON format
  formData.append("sizes", JSON.stringify(productData.sizes));

  // Send actual image files, not preview URLs
  productData.images.forEach(({ file }) => {
    formData.append("images", file);
  });

  const response = await api.post("/products", formData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const formData = new FormData();

  Object.entries(productData).forEach(([key, value]) => {
    if (key === "images") {
      value.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });
    } else if (key === "sizes") {
      formData.append("sizes", JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await api.put(`/products/${id}`, formData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
