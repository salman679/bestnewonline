import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCartProducts } from "./cartApi";
// Initial State
const initialState = {
  cartProducts: null,
  isLoading: false,
  isError: false,
  error: null,
};


export const getCartProducts = createAsyncThunk('services/getCartProducts', async () => {
  const Cartproducts = await fetchCartProducts()
  return Cartproducts
});




const serviceSlice = createSlice({
  name: "Cartproducts",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCartProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCartProducts.fulfilled, (state, action) => {
        state.Cartproducts = action.payload;
        state.isLoading = false;
      })
      .addCase(getCartProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  }
})


export default serviceSlice.reducer;