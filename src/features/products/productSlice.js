import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "./productsApi";
// Initial State
const initialState = {
  products: null,
  isLoading: false,
  isError: false,
  error: null,
};


export const getProducts = createAsyncThunk('services/getProducts', async () => {
  const products = await fetchProducts()
  return products
});




const serviceSlice = createSlice({
  name: "products",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  }
})


export default serviceSlice.reducer;