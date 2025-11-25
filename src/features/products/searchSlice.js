import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSearchProducts } from "./productsApi";

const initialState = {
  searchProducts: [],
  isLoading: false,
  isError: false,
  error: null,
  searchTerm: '',
  lastSearched: null,
};

export const getProducts = createAsyncThunk(
  'search/getProducts',
  async (search, { rejectWithValue }) => {
    try {
      const products = await fetchSearchProducts(search);
      if (!products) {
        throw new Error('No products found');
      }
      return products;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search products');
    }
  },
  {
    condition: (search, { getState }) => {
      const { search: { isLoading, lastSearched } } = getState();
      if (isLoading) return false;
      if (lastSearched === search) return false;
      return true;
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchProducts = [];
      state.searchTerm = '';
      state.isError = false;
      state.error = null;
      state.lastSearched = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchProducts = action.payload;
        state.isError = false;
        state.error = null;
        state.lastSearched = state.searchTerm;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.searchProducts = [];
      });
  }
});

export const { clearSearch, setSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;