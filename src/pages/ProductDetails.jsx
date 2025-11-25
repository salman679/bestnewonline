import Description from '../components/Product_Details/Description';
import Addtocart from '../components/Product_Details/Addtocart';
import RelatedData from '../components/Product_Details/RelatedData';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../lib/axiosInstanace';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
 
  
  

  useEffect(() => {
    setProduct(null); // নতুন slug এলে পুরনো প্রোডাক্ট clear করে দাও
    setIsLoading(true);
    const productfetch = async () => {
      try {
        const res = await axiosInstance(`/products/${params?.slug}`);
        setProduct(res?.data?.product);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setIsLoading(false);
      }
    };
    productfetch();
  }, [params?.slug]);

  if (isLoading) {
    return <div className='h-screen'> <div className="relative w-full h-screen flex justify-center items-center">
      <LoadingSpinner />
    </div>
    </div>
  }

  return (
    <>
      <div className="max-w-[1300px] mx-auto">
        <Addtocart oneProduct={product} isLoading={isLoading} />
        <Description oneProduct={product} isLoading={isLoading} />
        <RelatedData productCategory={product?.category} />
      </div>
    </>
  );
};

export default ProductDetails;
