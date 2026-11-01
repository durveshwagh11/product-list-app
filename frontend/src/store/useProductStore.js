import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// API is same-origin: served by Express in production, proxied by Vite in dev
const API_URL = "/api/products";
const EMPTY_FORM = { name: "", price: "", image: "" };

const errorMessage = (error) =>
  error.response?.data?.message || "Something went wrong";

export const useProductStore = create((set, get) => ({
  // products state
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state
  formData: EMPTY_FORM,

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: EMPTY_FORM }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(API_URL, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in addProduct function", error);
      toast.error(errorMessage(error));
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(API_URL);
      set({ products: response.data.data, error: null });
    } catch (err) {
      if (err.response?.status === 429)
        set({ error: "Rate limit exceeded", products: [] });
      else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  // returns true on success; no global loading so the list doesn't flash a spinner
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== Number(id)),
      }));
      toast.success("Product deleted successfully");
      return true;
    } catch (error) {
      console.log("Error in deleteProduct function", error);
      toast.error(errorMessage(error));
      return false;
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, // pre-fill form with current product data
        error: null,
      });
    } catch (error) {
      console.log("Error in fetchProduct function", error);
      set({ error: errorMessage(error), currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(`${API_URL}/${id}`, formData);
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error(errorMessage(error));
      console.log("Error in updateProduct function", error);
    } finally {
      set({ loading: false });
    }
  },
}));
