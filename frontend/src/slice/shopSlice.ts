import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const addProduct = createAsyncThunk(
  "shop/addProduct",
  async (payload: { formData: FormData; itemData: any }) => {
    const response = await axios.post(`${BASE_URL}/products`, payload.formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ...payload.itemData, id: response.data.id, image_url: response.data.image_url };
  }
);

export const addOffer = createAsyncThunk(
  "shop/addOffer",
  async (payload: { formData: FormData; itemData: any }) => {
    const response = await axios.post(`${BASE_URL}/offers`, payload.formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ...payload.itemData, id: response.data.id, image_url: response.data.image_url };
  }
);

export const addAd = createAsyncThunk(
  "shop/addAd",
  async (payload: { formData: FormData; itemData: any }) => {
    const response = await axios.post(`${BASE_URL}/ads`, payload.formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ...payload.itemData, id: response.data.id, image_url: response.data.image_url };
  }
);

export const fetchProducts = createAsyncThunk("shop/fetchProducts", async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data.products;
});

export const fetchOffers = createAsyncThunk("shop/fetchOffers", async () => {
  const response = await axios.get(`${BASE_URL}/offers`);
  return response.data.offers;
});

export const fetchAds = createAsyncThunk("shop/fetchAds", async () => {
  const response = await axios.get(`${BASE_URL}/ads`);
  return response.data.ads;
});

export const updateProduct = createAsyncThunk(
  "shop/updateProduct",
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await axios.put(`${BASE_URL}/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const updateOffer = createAsyncThunk(
  "shop/updateOffer",
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await axios.put(`${BASE_URL}/offers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const updateAd = createAsyncThunk(
  "shop/updateAd",
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await axios.put(`${BASE_URL}/ads/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk("shop/deleteProduct", async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/products/${id}`);
  return { id, ...response.data };
});

export const deleteOffer = createAsyncThunk("shop/deleteOffer", async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/offers/${id}`);
  return { id, ...response.data };
});

export const deleteAd = createAsyncThunk("shop/deleteAd", async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/ads/${id}`);
  return { id, ...response.data };
});

export const toggleProductSharing = createAsyncThunk(
  "shop/toggleProductSharing",
  async ({ id, isActive }: { id: number; isActive: boolean }) => {
    const endpoint = isActive ? "stop-sharing" : "resume-sharing";
    const response = await axios.patch(`${BASE_URL}/products/${id}/${endpoint}`);
    return response.data;
  }
);

export const toggleOfferSharing = createAsyncThunk(
  "shop/toggleOfferSharing",
  async ({ id, isActive }: { id: number; isActive: boolean }) => {
    const endpoint = isActive ? "stop-sharing" : "resume-sharing";
    const response = await axios.patch(`${BASE_URL}/offers/${id}/${endpoint}`);
    return response.data;
  }
);

export const toggleAdSharing = createAsyncThunk(
  "shop/toggleAdSharing",
  async ({ id, isActive }: { id: number; isActive: boolean }) => {
    const endpoint = isActive ? "stop-sharing" : "resume-sharing";
    const response = await axios.patch(`${BASE_URL}/ads/${id}/${endpoint}`);
    return response.data;
  }
);


const shopSlice = createSlice({
  name: "shop",
  initialState: {
    products: [] as any[],
    offers: [] as any[],
    ads: [] as any[],
    loading: false,      
    listLoading: false,  
    error: null as string | null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => { state.loading = true; })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload); 
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add product";
      })
      .addCase(addOffer.pending, (state) => { state.loading = true; })
      .addCase(addOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.unshift(action.payload);
      })
      .addCase(addOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add offer";
      })
      .addCase(addAd.pending, (state) => { state.loading = true; })
      .addCase(addAd.fulfilled, (state, action) => {
        state.loading = false;
        state.ads.unshift(action.payload);
      })
      .addCase(addAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add ad";
      })

      .addCase(fetchProducts.pending, (state) => { state.listLoading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.error.message || "Failed to load products";
      })
      .addCase(fetchOffers.pending, (state) => { state.listLoading = true; })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.listLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.error.message || "Failed to load offers";
      })
       .addCase(fetchAds.pending, (state) => { state.listLoading = true; })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.listLoading = false;
        state.ads = action.payload;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.error.message || "Failed to load ads";
      })

      .addCase(updateProduct.pending, (state) => { state.loading = true; })
      .addCase(updateProduct.fulfilled, (state) => { state.loading = false; })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })
      .addCase(updateOffer.pending, (state) => { state.loading = true; })
      .addCase(updateOffer.fulfilled, (state) => { state.loading = false; })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update offer";
      })
      .addCase(updateAd.pending, (state) => { state.loading = true; })
      .addCase(updateAd.fulfilled, (state) => { state.loading = false; })
      .addCase(updateAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update ad";
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload.id);
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.offers = state.offers.filter((o) => o.id !== action.payload.id);
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.ads = state.ads.filter((a) => a.id !== action.payload.id);
      })

      .addCase(toggleProductSharing.fulfilled, (state, action) => {
        const p = state.products.find((item) => item.id === action.payload.id);
        if (p) p.is_active = action.payload.is_active;
      })
      .addCase(toggleOfferSharing.fulfilled, (state, action) => {
        const o = state.offers.find((item) => item.id === action.payload.id);
        if (o) o.is_active = action.payload.is_active;
      })
      .addCase(toggleAdSharing.fulfilled, (state, action) => {
        const a = state.ads.find((item) => item.id === action.payload.id);
        if (a) a.is_active = action.payload.is_active;
      });
  },
});

export default shopSlice.reducer;