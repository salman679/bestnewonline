import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../lib/axiosInstance";

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (category) => {
    if (!category) {
      const response = await axiosInstance("/products/category");
      if (response.data.length > 0) {
        return response.data;
      } else {
        return [];
      }
    } else {
      const response = await axiosInstance(`/products/category/${category}`);
      if (response.data.length > 0) {
        return response.data;
      } else {
        return [];
      }
    }
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  activeFilters: {
    priceRange: null,
    category: null,
    subCategory: null,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
    clearFilters: (state) => {
      state.filteredProducts = state.products;
      state.activeFilters = {
        priceRange: null,
        category: null,
        subCategory: null,
      };
    },
    setCategoryFilter: (state, action) => {
      const { category, subCategory } = action.payload;
      state.activeFilters.category = category;
      state.activeFilters.subCategory = subCategory;

      // Apply all active filters
      let filtered = [...state.products];

      // Apply category filter
      if (category) {
        filtered = filtered.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Apply subcategory filter
      if (subCategory) {
        filtered = filtered.filter(
          (product) =>
            product.subCategory.toLowerCase() === subCategory.toLowerCase()
        );
      }

      // Apply price filter if active
      if (state.activeFilters.priceRange) {
        const [min, max] = state.activeFilters.priceRange;
        filtered = filtered.filter((product) => {
          const discountedPrice =
            product.price - (product.price * (product.discount || 0)) / 100;
          return discountedPrice >= min && discountedPrice <= max;
        });
      }

      state.filteredProducts = filtered;
    },
    setPriceFilter: (state, action) => {
      const [min, max] = action.payload;
      state.activeFilters.priceRange = [min, max];

      // Apply all active filters
      let filtered = [...state.products];

      // Apply price filter
      filtered = filtered.filter((product) => {
        const discountedPrice =
          product.price - (product.price * (product.discount || 0)) / 100;
        return discountedPrice >= min && discountedPrice <= max;
      });

      // Apply category filter if active
      if (state.activeFilters.category) {
        filtered = filtered.filter(
          (product) =>
            product.category.toLowerCase() ===
            state.activeFilters.category.toLowerCase()
        );
      }

      // Apply subcategory filter if active
      if (state.activeFilters.subCategory) {
        filtered = filtered.filter(
          (product) =>
            product.subCategory.toLowerCase() ===
            state.activeFilters.subCategory.toLowerCase()
        );
      }

      state.filteredProducts = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.products = [];
        state.filteredProducts = [];
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setFilteredProducts,
  clearFilters,
  setCategoryFilter,
  setPriceFilter,
} = productSlice.actions;

export default productSlice.reducer;
