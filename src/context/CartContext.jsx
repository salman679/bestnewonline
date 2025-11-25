import { createContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import useLocalStorage from '../hooks/useLocalStorage';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'
export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage('cart', []);
  const [isCartOpen, setIsCartOpen] = useLocalStorage('isCartOpen', false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);




  // Add item to cart
  const addToCart = (product, quantity = 1) => {

    try {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === product._id);
        if (existingItem) {
          return prevCart.map(item =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, {
          productId: product._id,
          name: product.name,
          price: product.price + product.selectedAditionalPrice,
          finalPrice: product.finalPrice,
          image: product.image[0],
          quantity,
          discount: product.discount,
          shippingCost: product.shippingCost,
          selectedColor: product.selectedColor,
          selectedSize: product.selectedSize,
          selectedAditionalPrice: product.selectedAditionalPrice,
        }];


      });

      setIsCartOpen(true); // Open sidebar when item is added
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };


  // Add item to cart for buy now button
  const addToCartBuyNow = (product, quantity = 1) => {

    try {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === product._id);
        if (existingItem) {
          return prevCart.map(item =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, {
          productId: product._id,
          name: product.name,
          price: product.price + product.selectedAditionalPrice,
          finalPrice: product.finalPrice,
          image: product.image[0],
          quantity,
          discount: product.discount,
          shippingCost: product.shippingCost,
          selectedColor: product.selectedColor,
          selectedSize: product.selectedSize
        }];
      });

      toast.success('Proceeding to checkout...');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    try {
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Handle checkout process
  const handleCheckout = (user, navigate) => {
    if (!cart.length) {
      toast.error('Your cart is empty');
      return;
    }


    navigate('/checkout');
    setIsCartOpen(false);


  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      handleCheckout,
      addToCartBuyNow
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;