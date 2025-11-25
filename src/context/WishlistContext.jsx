import { createContext } from 'react';
import { toast } from 'react-hot-toast';
import useLocalStorage from '../hooks/useLocalStorage';

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useLocalStorage('wishlist', []);

  // Add/Remove item from wishlist
  const toggleWishlist = (product) => {



    try {
      const isInWishlist = wishlist.some(item => item.productId === product._id);

      if (isInWishlist) {
        setWishlist(prevWishlist =>
          prevWishlist.filter(item => item.productId !== product._id)
        );
        toast.success(`${product.name} Removed from wishlist`);
      } else {
        setWishlist(prevWishlist => [...prevWishlist, {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image[0],
          slug: product.slug,
          discount: product.discount,
          category: product.category
        }]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider; 