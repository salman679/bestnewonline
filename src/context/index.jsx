import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axiosInstanace";
import { toast } from "react-hot-toast";

export const IndexContext = createContext()


const ThemeProvider = ({ children }) => {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);


  // facebook pixel
  const [isEnabled, setIsEnabled] = useState(false);



  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance('/settings');
      setSiteSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };
  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    productId,
    setProductId,
    siteSettings,
    setSiteSettings,
    refetch,
    setRefetch,
    isEnabled,
    setIsEnabled
  }
  return (

    <IndexContext.Provider value={value}>
      {children}
    </IndexContext.Provider>

  )
}


export default ThemeProvider