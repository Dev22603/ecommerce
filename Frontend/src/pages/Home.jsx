import React, { useState, useEffect, useRef } from "react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import {
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCode,
  HiOutlineTag,
  HiOutlineRefresh,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineCash,
  HiOutlineSupport,
  HiOutlinePhone,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const productsRef = useRef(null);

  const fetchProducts = async (pageNum) => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts(pageNum);
      const { products, totalPages } = response;
      setProducts(products);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (pageNum = 1) => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchProducts(pageNum);
      return;
    }

    setIsLoading(true);
    try {
      setIsSearching(true);
      let result;
      if (searchType === "name") {
        result = await productService.getProductsByName(searchQuery, pageNum);
      } else {
        result = await productService.getProductsByWsCode(searchQuery, pageNum);
      }
      const { products, totalPages } = result;
      setProducts(products);
      setTotalPages(totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSearching) {
      handleSearch(page);
    } else {
      fetchProducts(page);
    }
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    handleSearch(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setPage(1);
    fetchProducts(1);
  };

  const features = [
    {
      icon: HiOutlineTruck,
      title: "Fast Delivery",
      desc: "Quick dispatch across Gujarat",
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Quality Products",
      desc: "100% genuine items",
    },
    {
      icon: HiOutlineCash,
      title: "Wholesale Rates",
      desc: "Best prices guaranteed",
    },
    {
      icon: HiOutlineSupport,
      title: "WhatsApp Support",
      desc: "Direct contact available",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919173706508?text=Hi%2C%20I%27m%20interested%20in%20your%20wholesale%20products"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110">
            <FaWhatsapp className="w-7 h-7 text-white" />
          </div>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-nexus-800 text-nexus-50 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg border border-nexus-600">
            Chat with us!
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full" />
        </div>
      </a>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-900 via-nexus-850 to-nexus-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 168, 83, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 168, 83, 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm text-accent font-medium">
                Wholesale Only - Since 1995
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-nexus-50 mb-6 animate-fade-in-up tracking-tight">
              Party Supplies &{" "}
              <span className="text-gradient">Accessories</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-nexus-200 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
              Belts, Purses, Goggles, Gift Paper, Birthday Decorations, Balloons & more.
              Quality wholesale products from Ahmedabad's trusted Tankshal market.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto animate-fade-in-up animation-delay-200"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-400">
                    {searchType === "name" ? (
                      <HiOutlineSearch className="w-5 h-5" />
                    ) : (
                      <HiOutlineCode className="w-5 h-5" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder={
                      searchType === "name"
                        ? "Search products by name..."
                        : "Enter WS Code..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-nexus-800/80 border border-nexus-600/50 rounded-xl
                      text-nexus-50 placeholder-nexus-400
                      focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                      transition-all duration-300"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="px-4 py-4 bg-nexus-800/80 border border-nexus-600/50 rounded-xl
                      text-nexus-100 text-sm
                      focus:outline-none focus:border-accent
                      transition-all duration-300 cursor-pointer"
                  >
                    <option value="name">By Name</option>
                    <option value="ws_code">By Code</option>
                  </select>

                  <button type="submit" className="btn-primary px-8">
                    <HiOutlineSearch className="w-5 h-5" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 animate-fade-in-up animation-delay-300">
              <div className="text-center">
                <p className="font-heading text-3xl font-bold text-accent">
                  25+
                </p>
                <p className="text-sm text-nexus-300">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-3xl font-bold text-accent">
                  1000+
                </p>
                <p className="text-sm text-nexus-300">Products</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-3xl font-bold text-accent">
                  Fast
                </p>
                <p className="text-sm text-nexus-300">Dispatch</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Fade to Products */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nexus-900 to-transparent" />
      </section>

      {/* Features Strip */}
      <section className="relative bg-nexus-850 border-y border-nexus-700/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-nexus-50 text-sm">
                    {feature.title}
                  </p>
                  <p className="text-xs text-nexus-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="py-12 lg:py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-nexus-50">
                {isSearching ? (
                  <>
                    Results for "{searchQuery}"
                    <button
                      onClick={clearSearch}
                      className="ml-4 text-sm font-normal text-nexus-300 hover:text-accent transition-colors inline-flex items-center gap-1"
                    >
                      <HiOutlineRefresh className="w-4 h-4" />
                      Clear
                    </button>
                  </>
                ) : (
                  "All Products"
                )}
              </h2>
              <p className="text-nexus-300 mt-1">
                {isSearching
                  ? `Found ${products.length} products`
                  : "Browse our complete catalog"}
              </p>
            </div>

            {/* Page Info */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-nexus-400">
                Page {page} of {totalPages}
              </span>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-nexus-800/40 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-nexus-700/50" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-nexus-700/50 rounded w-1/3" />
                    <div className="h-5 bg-nexus-700/50 rounded w-3/4" />
                    <div className="h-4 bg-nexus-700/50 rounded w-1/2" />
                    <div className="h-8 bg-nexus-700/50 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-nexus-800 rounded-2xl mb-6">
                <HiOutlineTag className="w-10 h-10 text-nexus-400" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-nexus-100 mb-2">
                No products found
              </h3>
              <p className="text-nexus-400 mb-6">
                {isSearching
                  ? "Try adjusting your search terms"
                  : "Check back later for new products"}
              </p>
              {isSearching && (
                <button onClick={clearSearch} className="btn-secondary">
                  <HiOutlineRefresh className="w-4 h-4" />
                  View All Products
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="pagination-btn pagination-btn-inactive disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <HiOutlineChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const showPage =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - page) <= 1;

                  if (!showPage) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return (
                        <span
                          key={i}
                          className="w-10 text-center text-nexus-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`pagination-btn ${
                        page === pageNum
                          ? "pagination-btn-active"
                          : "pagination-btn-inactive"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="pagination-btn pagination-btn-inactive disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <HiOutlineChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-850 via-nexus-800 to-nexus-850" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-nexus-50 mb-6">
            Ready to Stock Your Shop?
          </h2>
          <p className="text-lg text-nexus-200 mb-8 max-w-2xl mx-auto">
            Get the best wholesale prices on party supplies and accessories.
            Trusted by retailers across Gujarat. Contact us on WhatsApp for bulk orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                productsRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-primary btn-lg"
            >
              Browse Products
            </button>
            <a
              href="https://wa.me/919173706508?text=Hi%2C%20I%27m%20interested%20in%20your%20wholesale%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-lg inline-flex items-center gap-2"
            >
              <FaWhatsapp className="w-5 h-5 text-green-500" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nexus-850 border-t border-nexus-700/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center border border-accent/30">
                  <span className="font-heading font-black text-accent text-sm">
                    DT
                  </span>
                </div>
                <div>
                  <span className="font-heading font-bold text-nexus-50 block">
                    DEV TRADERS
                  </span>
                  <span className="text-[10px] text-accent font-medium tracking-widest">
                    WHOLESALE ONLY
                  </span>
                </div>
              </div>
              <p className="text-sm text-nexus-300">
                Quality wholesale party supplies and accessories since 1995.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading font-semibold text-nexus-50 mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm text-nexus-300">
                <p>Nilesh G. Bachani</p>
                <p className="flex items-center gap-2">
                  <span className="text-accent">WhatsApp:</span>
                  <a href="https://wa.me/919173706508" className="hover:text-accent transition-colors">
                    +91 98246 31234
                  </a>
                </p>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-heading font-semibold text-nexus-50 mb-4">Visit Us</h4>
              <p className="text-sm text-nexus-300">
                1610, Tankshal Ni Pole,<br />
                Opp. N.C. Bodiwala College,<br />
                Kalupur, Tankshal,<br />
                Ahmedabad - 380001
              </p>
            </div>
          </div>

          <div className="border-t border-nexus-700/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-nexus-400">
              &copy; {new Date().getFullYear()} Dev Traders. All rights reserved.
            </p>
            <p className="text-xs text-nexus-500">
              Tankshal Market, Ahmedabad
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
