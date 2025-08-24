import { useState } from 'react'
import './App.css'
import Login from './pages/login'
import { Routes, Route, Navigate } from 'react-router-dom'   // 🔹 added Navigate
import Navbar from './components/navbar'
import Home from './pages/home'
import Collection from './pages/collection'
import ProductDetails from './pages/prdouctdetails'
import Wishlist from './pages/wishlist'
import Cart from './pages/cart'
import Order from './pages/order'
import { SearchProvider } from './components/search'
import Register from './pages/register'


function App() {
  const isLoggedIn = localStorage.getItem("userId"); // 🔹 check if user is logged in
  
  return (
    <>
      <SearchProvider>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          
          {/* if logged in → go to home, else show login/register */}
          <Route path='/login' element={isLoggedIn ? <Navigate to="/" /> : <Login/>}/>
          <Route path='/register' element={isLoggedIn ? <Navigate to="/" /> : <Register/>}/>

          <Route path='/collection' element={<Collection/>}/>
          <Route path='/product/:id' element={<ProductDetails/>}/>
          <Route path='/wishlist' element ={<Wishlist/>}/>
          <Route path='/cart' element ={<Cart/>}/>
          <Route path='/order' element = {<Order/>}/>
        </Routes>
      </SearchProvider>
    </>
  )
}

export default App
