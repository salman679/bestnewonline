import { axiosInstance } from "../../lib/axiosInstanace";

export const fetchCartProducts = async () => {

  try {
    const response = await axiosInstance(`/products`);


    return response.data
  } catch (error) {
    console.log(error);

  }
};