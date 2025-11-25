import { axiosInstance } from "../../lib/axiosInstanace";

export const fetchProducts = async () => {
  try {

    const response = await axiosInstance(`/products`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch products"
    );
  }
};


export const fetchSearchProducts = async (search) => {
  try {
    if (!search?.trim()) {
      return [];
    }
    const trimmedSearch = search.trim();
    const encodedSearch = encodeURIComponent(trimmedSearch);

    const response = await axiosInstance('/products/search/ser', {
      params: {
        q: encodedSearch,
        limit: 10
      }
    });

    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to search products');
    }


    return response.data?.data?.products || [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to search products'
    );
  }
};