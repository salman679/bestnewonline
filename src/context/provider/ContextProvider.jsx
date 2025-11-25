import { AdminIndexProvider } from "../admin-dashboard/Admin_Context"
import AuthProvider from "../auth/AuthContext"
import CartProvider from "../CartContext"
import ThemeProvider from "../index"



const ContextProvider = ({ children }) => {
  return (
    <>
      <AdminIndexProvider>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </AdminIndexProvider>
    </>
  )
}

export default ContextProvider