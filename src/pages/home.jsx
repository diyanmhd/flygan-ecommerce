import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Home = () => {
  const slides = [
    {
      id: 1,
      image:
        "https://cdn.mos.cms.futurecdn.net/whowhatwear/posts/305052/new-zara-arrivals-305052-1686254778434-main.jpg",
      title: "Summer Collection 2023",
      subtitle: "Discover our premium collection of contemporary shirts",
      cta: "Shop Now"
    },
    {
      id: 2,
      image:
        "https://i.pinimg.com/736x/bc/bc/ed/bcbced2f45fd1e9ccd57e82bca836cd8.jpg",
      title: "Casual & Comfortable",
      subtitle: "Perfect blend of style and comfort for everyday wear",
      cta: "Explore Collection"
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Premium Fabrics",
      subtitle: "Experience luxury with our carefully selected materials",
      cta: "Discover Quality"
    }
  ];

  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);

  // slider auto change
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // fetch first 8 products
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(0, 8));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        setIsLoading(false);
      });
  }, []);

  // Now properly toggles wishlist items
  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("⚠️ Please login to add items to wishlist");
      return;
    }

    let newWishlist;
    if (wishlist.includes(id)) {
      newWishlist = wishlist.filter((pid) => pid !== id);
    } else {
      newWishlist = [...wishlist, id];
    }
    
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  // Manual slider navigation
  const nextSlide = () => {
    setCurrent((current + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((current - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Enhanced Slider */}
      <section className="relative">
        <div className="relative h-80 md:h-[600px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === current 
                  ? "opacity-100 translate-x-0" 
                  : index < current 
                    ? "-translate-x-full opacity-0" 
                    : "translate-x-full opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center px-4 max-w-4xl">
                    <h1 className="prata-regular text-4xl md:text-6xl font-bold text-white tracking-wide mb-4 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in delay-150">
                      {slide.subtitle}
                    </p>
                    <Link
                      to="/collection"
                      className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in delay-300"
                    >
                      {slide.cta}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current ? "bg-white w-8" : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="prata-regular text-xl font-semibold text-[#414141] mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Free shipping on all orders above $999
              </p>
            </div>
            <div className="text-center group p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">↩️</span>
              </div>
              <h3 className="prata-regular text-xl font-semibold text-[#414141] mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                30-day hassle-free return policy
              </p>
            </div>
            <div className="text-center group p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="prata-regular text-xl font-semibold text-[#414141] mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                100% premium cotton and finest materials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="prata-regular text-3xl md:text-4xl tracking-wide text-[#414141] mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium shirts crafted with attention to detail and superior quality materials.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Wishlist Heart Added proper event handling */}
                  <button
                    onClick={(e) => toggleWishlist(item.id, e)}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      wishlist.includes(item.id) 
                        ? "bg-red-100 text-red-500 opacity-100" 
                        : "bg-white shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500"
                    }`}
                  >
                    {wishlist.includes(item.id) ? (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>

                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="block">
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="prata-regular text-sm md:text-base tracking-wide text-[#414141] mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm md:text-base text-amber-700">
                          ${item.price}
                        </p>
                        <div className="flex items-center text-yellow-400">
                          <span className="text-xs">⭐⭐⭐⭐⭐</span>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {item.description.slice(0, 60)}...
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Link
              to="/collection"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-md font-medium hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span className="tracking-wider">View All Products</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="prata-regular text-3xl md:text-4xl mb-4">
            Summer Sale: Up to 30% Off
          </h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
            Limited time offer on our premium summer collection. Don't miss out on these exclusive deals.
          </p>
          {/* <div className="flex justify-center space-x-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <span className="text-2xl font-bold">02</span>
              <p className="text-sm">Days</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <span className="text-2xl font-bold">18</span>
              <p className="text-sm">Hours</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <span className="text-2xl font-bold">45</span>
              <p className="text-sm">Minutes</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <span className="text-2xl font-bold">30</span>
              <p className="text-sm">Seconds</p>
            </div>
          </div> */}

        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="prata-regular text-3xl md:text-4xl tracking-wide text-[#414141] mb-6">
                Crafted for Excellence
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At Shirt Store, we believe that exceptional quality shouldn't come at the expense of style. 
                Our collection features premium shirts crafted from the finest materials, designed for the 
                modern professional who values both comfort and sophistication.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Each piece is carefully selected and quality-tested to ensure it meets our high standards. 
                From casual weekends to important business meetings, our shirts are designed to make you 
                look and feel your best.
              </p>

            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our Story"
                className="w-full h-80 object-cover rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-700 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
     



      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="prata-regular text-xl text-white mb-4">Shirt Store</h3>
              <p className="text-sm leading-relaxed mb-4">
                Premium quality shirts for the modern professional. 
                Crafted with care, designed for excellence.
              </p>
              <div className="flex space-x-4">
                <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-300">📘</span>
                <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-300">📷</span>
                <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-300">🐦</span>
              </div>
            </div>
<div>
  <h4 className="text-white font-medium mb-4">Quick Links</h4>
  <ul className="space-y-2 text-sm">
    <li className="hover:text-white transition-colors">Shop All</li>
    <li className="hover:text-white transition-colors">About Us</li>
    <li className="hover:text-white transition-colors">Contact</li>
    <li className="hover:text-white transition-colors">Size Guide</li>
  </ul>
</div>

<div>
  <h4 className="text-white font-medium mb-4">Customer Care</h4>
  <ul className="space-y-2 text-sm">
    <li className="hover:text-white transition-colors">Shipping Info</li>
    <li className="hover:text-white transition-colors">Returns</li>
    <li className="hover:text-white transition-colors">FAQ</li>
    <li className="hover:text-white transition-colors">Support</li>
  </ul>
</div>

            <div>
              <h4 className="text-white font-medium mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">📧 contact@shirtstore.com</p>
                <p className="flex items-center gap-2">📞 (123) 456-7890</p>
                <p className="flex items-center gap-2">📍 123 Fashion Street<br />Style City, SC 12345</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="prata-regular text-white text-sm tracking-wide mb-2">
              Quality Shirts, Premium Look
            </p>
            <p className="text-xs text-gray-500">
              © 2023 Shirt Store. All Rights Reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;