import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import productService from "../services/productService";
import wishlistService from "../services/wishlistService";

const Home = () => {
  /* ---------------- SLIDER DATA ---------------- */
  const slides = [
    {
      id: 1,
      image:
        "https://cdn.mos.cms.futurecdn.net/whowhatwear/posts/305052/new-zara-arrivals-305052-1686254778434-main.jpg",
      title: "Summer Collection 2023",
      subtitle: "Discover our premium collection of contemporary shirts",
      cta: "Shop Now",
    },
    {
      id: 2,
      image:
        "https://i.pinimg.com/736x/bc/bc/ed/bcbced2f45fd1e9ccd57e82bca836cd8.jpg",
      title: "Casual & Comfortable",
      subtitle: "Perfect blend of style and comfort for everyday wear",
      cta: "Explore Collection",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
      title: "Premium Fabrics",
      subtitle: "Experience luxury with our carefully selected materials",
      cta: "Discover Quality",
    },
  ];

  /* ---------------- STATE ---------------- */
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);

  /* ---------------- SLIDER AUTO PLAY ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    setIsLoading(true);
    productService
      .getAll()
      .then((res) => {
        if (res.data?.success) {
          setProducts(res.data.data.slice(0, 8));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Product fetch error", err);
        setIsLoading(false);
      });
  }, []);

  /* ---------------- FETCH WISHLIST (BACKEND) ---------------- */
  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }

    wishlistService
      .getWishlist()
      .then((res) => {
        const ids = (res.data.data || []).map((w) => w.productId);
        setWishlistIds(ids);
      })
      .catch((err) => console.error("Wishlist fetch failed", err));
  }, [user]);

  /* ---------------- TOGGLE WISHLIST ---------------- */
  const toggleWishlist = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login to use wishlist");
      return;
    }

    try {
      if (wishlistIds.includes(id)) {
        await wishlistService.removeFromWishlist(id);
        setWishlistIds((prev) => prev.filter((pid) => pid !== id));
      } else {
        await wishlistService.addToWishlist(id);
        setWishlistIds((prev) => [...prev, id]);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setWishlistIds((prev) =>
          prev.includes(id) ? prev : [...prev, id]
        );
      } else {
        console.error("Wishlist toggle failed", err);
      }
    }
  };

  /* ---------------- SLIDER CONTROLS ---------------- */
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HERO SECTION ================= */}
      <section className="relative">
        <div className="relative h-80 md:h-[600px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center px-6 text-white max-w-4xl">
                  <h1 className="prata-regular text-4xl md:text-6xl mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-2xl mb-8">
                    {slide.subtitle}
                  </p>
                  <Link
                    to="/collection"
                    className="inline-flex bg-white text-black px-8 py-4 rounded-md font-medium"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 text-white text-xl"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 text-white text-xl"
        >
          ▶
        </button>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="prata-regular text-3xl text-center mb-12">
            Featured Products
          </h2>

          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-xl"
                >
                  {/* Wishlist */}
                  <button
                    onClick={(e) => toggleWishlist(item.id, e)}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10 ${
                      wishlistIds.includes(item.id)
                        ? "bg-red-100 text-red-500"
                        : "bg-white shadow opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {wishlistIds.includes(item.id) ? "❤️" : "🤍"}
                  </button>

                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-60 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="prata-regular text-sm mb-2">
                        {item.name}
                      </h3>
                      <p className="font-semibold text-amber-700">
                        ₹{item.price}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="prata-regular text-3xl mb-6">
              Crafted for Excellence
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Premium quality shirts for the modern professional.
              Crafted with care, designed for excellence.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            alt="About"
            className="rounded-lg shadow-xl"
          />
        </div>
      </section>

      {/* ================= FOOTER (YOUR EXACT CODE) ================= */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="prata-regular text-xl text-white mb-4">
                Shirt Store
              </h3>
              <p className="text-sm leading-relaxed mb-4">
                Premium quality shirts for the modern professional.
                Crafted with care, designed for excellence.
              </p>
              <div className="flex space-x-4">
                <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  📘
                </span>
                <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  📷
                </span>
                <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  🐦
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>Shop All</li>
                <li>About Us</li>
                <li>Contact</li>
                <li>Size Guide</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Customer Care</h4>
              <ul className="space-y-2 text-sm">
                <li>Shipping Info</li>
                <li>Returns</li>
                <li>FAQ</li>
                <li>Support</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Contact Info</h4>
              <p className="text-sm">📧 contact@shirtstore.com</p>
              <p className="text-sm">📞 (123) 456-7890</p>
              <p className="text-sm">📍 Style City, SC</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="prata-regular text-white text-sm mb-2">
              Quality Shirts, Premium Look
            </p>
            <p className="text-xs text-gray-500">
              © 2023 Shirt Store. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
