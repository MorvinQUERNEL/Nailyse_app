import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Root Application Component
 *
 * Configures routing and global context providers for the Nailyse application.
 * Manages the application's authentication, theme, and shopping cart state.
 *
 * Context Providers:
 * - AuthProvider: User authentication and authorization
 * - ThemeProvider: Light/dark theme management
 * - CartProvider: Shopping cart state management
 *
 * Routes:
 * Public Routes:
 * - / : Home page
 * - /shop : Product catalog
 * - /appointments : Appointment booking
 * - /login : User login
 * - /register : User registration
 *
 * Protected Routes (require authentication):
 * - /checkout : Payment checkout
 * - /payment/success : Payment confirmation
 * - /payment/cancel : Payment cancellation
 *
 * @author Nailyse Team
 * @returns {JSX.Element} Application component
 */
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes (require authentication) */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/success"
                  element={
                    <ProtectedRoute>
                      <PaymentSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/cancel"
                  element={
                    <ProtectedRoute>
                      <PaymentCancel />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
            </Router>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
