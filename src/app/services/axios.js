import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const fetchFeaturedProducts = async () => {
  const { data: serverResponse } = await api.get("/products?featured=true");
  return serverResponse.data;
};

export const fetchSingleProduct = async (_id) => {
  const { data: serverResponse } = await api.get(`/products/${_id}`);
  return serverResponse.data;
};

export const fetchAllProducts = async () => {
  const { data: serverResponse } = await api.get("/products");
  return serverResponse.data;
};

export const fetchFilterProducts = async (filter) => {
  const res = await api.get("/products", {
    params: filter,
  });
  return res.data;
};
