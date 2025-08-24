import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Collection from './pages/collection';
import ProductDetails from './pages/prdouctdetails';
import Wishlist from './pages/wishlist';
import Cart from './pages/cart';
import Order from './pages/order';
import Login from './pages/login';
import Register from './pages/register';
import { SearchProvider } from './components/search';
import { UserProvider, UserContext } from './components/UserContext';

function App() {
  return (
    <UserProvider> {/* ✅ wrap first */}
      <SearchProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />

          {/* if logged in → go to home, else show login/register */}
          <Route
            path='/login'
            element={
              <UserContext.Consumer>
                {({ user }) => (user ? <Navigate to="/" /> : <Login />)}
              </UserContext.Consumer>
            }
          />
          <Route
            path='/register'
            element={
              <UserContext.Consumer>
                {({ user }) => (user ? <Navigate to="/" /> : <Register />)}
              </UserContext.Consumer>
            }
          />

          <Route path='/collection' element={<Collection />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<Order />} />
        </Routes>
      </SearchProvider>
    </UserProvider>
  );
}

export default App;
