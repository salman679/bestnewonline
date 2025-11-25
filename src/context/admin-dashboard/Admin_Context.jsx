/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const AdminContext = createContext();

export const AdminIndexProvider = ({ children }) => {
  const [reFetchCategory, setReFetchCategory] = useState(false);
  const value = {
    reFetchCategory,
    setReFetchCategory,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};