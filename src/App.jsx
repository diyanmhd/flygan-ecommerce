import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Collection from "./pages/collection";
import ProductDetails from "./pages/prdouctdetails";
import Wishlist from "./pages/wishlist";
import Cart from "./pages/cart";
import Order from "./pages/order";
import Login from "./pages/login";
import Register from "./pages/register";
import { SearchProvider } from "./components/search";
import { UserProvider, UserContext } from "./components/UserContext";

function App() {
  const location = useLocation();

  
  const ProtectedRoute = ({ children }) => (
    <UserContext.Consumer>
      {({ user }) => (user ? children : <Navigate to="/login" replace />)}
    </UserContext.Consumer>
  );

  
  const AuthRoute = ({ children }) => (
    <UserContext.Consumer>
      {({ user }) => (user ? <Navigate to="/" replace /> : children)}
    </UserContext.Consumer>
  );

  
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <UserProvider>
      <SearchProvider>
        {!hideNavbar && <Navbar />}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />
        </Routes>
      </SearchProvider>
    </UserProvider>
  );
}

export default App;
