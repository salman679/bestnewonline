import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../redux/features/products/productSlice';
import searchReducer from '../features/products/searchSlice';
import cartReducer from '../redux/features/cart/cartSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    search: searchReducer,
    cart: cartReducer,
  }
});

export default store;