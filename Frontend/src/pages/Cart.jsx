import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartService } from "../services/cartService";
import { orderService } from "../services/ordersService";
import { addressService } from "../services/addressService";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import {
  HiOutlineShoppingCart,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineTrash,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlinePhotograph,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineReceiptRefund,
  HiOutlineLocationMarker,
  HiOutlineX,
} from "react-icons/hi";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    house_number: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    address_type: "Home",
  });
  const { user } = useContext(AuthContext);
  const { refreshCart } = useContext(CartContext);
  const token = user?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchCartItems();
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const data = await addressService.getAddresses(token);
      setAddresses(data);
      const defaultAddr = data.find((a) => a.is_default) || data[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const created = await addressService.createAddress(token, newAddress);
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      setNewAddress({
        full_name: "",
        phone: "",
        house_number: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        address_type: "Home",
      });
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to add address");
    } finally {
      setSavingAddress(false);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart(1, 100, token);
      const items = response.items || [];
      const updatedItems = items.map((item) => {
        return {
          ...item,
          price: item.sales_price,
          mrp: item.mrp,
          totalPrice: item.sales_price * item.quantity,
          stock: item.stock,
        };
      });
      setCartItems(updatedItems);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setUpdating(productId);
    try {
      if (quantity > 0) {
        await cartService.updateCart(productId, quantity, token);
      } else {
        await cartService.removeItemFromCart(productId, token);
      }
      await fetchCartItems();
      await refreshCart();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId) => {
    setUpdating(productId);
    try {
      await cartService.removeItemFromCart(productId, token);
      await fetchCartItems();
      await refreshCart();
      toast.info("Item removed from cart", { autoClose: 1000 });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(null);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    setPlacingOrder(true);
    try {
      await orderService.createOrder(token, selectedAddressId);
      setCartItems([]);
      await refreshCart();
      toast.success("Order placed successfully!", { autoClose: 1500 });
      setTimeout(() => navigate("/my-orders"), 1500);
    } catch (error) {
      toast.error(error.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalMRP = cartItems.reduce(
    (sum, item) => sum + (item.mrp || item.price) * item.quantity,
    0
  );
  const discount = totalMRP - subtotal;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Empty Cart State
  if (!loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-nexus-900">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-nexus-800 rounded-2xl mb-6">
              <HiOutlineShoppingCart className="w-12 h-12 text-nexus-400" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-nexus-50 mb-4">
              Your cart is empty
            </h1>
            <p className="text-nexus-300 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products yet. Browse our catalog
              to find great wholesale deals.
            </p>
            <Link to="/" className="btn-primary btn-lg">
              <HiOutlineArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexus-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-nexus-50">
              Shopping Cart
            </h1>
            <p className="text-nexus-300 mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Link
            to="/"
            className="btn-ghost hidden sm:flex items-center gap-2"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          // Loading Skeleton
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-nexus-800/40 rounded-2xl p-4 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-nexus-700 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-nexus-700 rounded w-3/4" />
                      <div className="h-4 bg-nexus-700 rounded w-1/2" />
                      <div className="h-6 bg-nexus-700 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-nexus-800/40 rounded-2xl p-6 h-64 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-nexus-700 rounded w-1/2" />
                <div className="h-4 bg-nexus-700 rounded w-3/4" />
                <div className="h-4 bg-nexus-700 rounded w-2/3" />
                <div className="h-12 bg-nexus-700 rounded mt-6" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.product_id || item.id || index}
                  className="card p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-28 h-28 bg-nexus-700/30 rounded-xl overflow-hidden flex-shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={`http://localhost:5000/api${item.images[0]}`}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiOutlinePhotograph className="w-8 h-8 text-nexus-500" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-heading font-semibold text-nexus-50 truncate">
                            {item.product_name}
                          </h3>
                          {item.ws_code && (
                            <p className="text-xs text-nexus-400 mt-1">
                              Code: #{item.ws_code}
                            </p>
                          )}
                          <p className="text-xs text-nexus-400 mt-1">
                            {item.stock > 0 ? (
                              <span className="text-status-success">
                                In Stock ({item.stock} available)
                              </span>
                            ) : (
                              <span className="text-status-error">
                                Out of Stock
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-left sm:text-right">
                          <p className="font-heading font-bold text-xl text-accent">
                            ₹{item.totalPrice.toLocaleString()}
                          </p>
                          <p className="text-sm text-nexus-400">
                            ₹{item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-nexus-700/50 rounded-xl p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                            disabled={updating === item.product_id}
                            className="p-2 text-nexus-100 hover:bg-nexus-600 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <HiOutlineMinus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-semibold text-nexus-50">
                            {updating === item.product_id ? (
                              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                            disabled={
                              updating === item.product_id ||
                              item.quantity >= item.stock
                            }
                            className="p-2 text-nexus-100 hover:bg-nexus-600 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <HiOutlinePlus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product_id)}
                          disabled={updating === item.product_id}
                          className="btn-ghost btn-sm text-status-error hover:bg-status-error/10"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-4">
              {/* Delivery Address */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-bold text-nexus-50 flex items-center gap-2">
                    <HiOutlineLocationMarker className="w-5 h-5 text-accent" />
                    Delivery Address
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="btn-ghost btn-sm text-accent"
                  >
                    <HiOutlinePlus className="w-4 h-4" />
                    Add New
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-nexus-400 text-sm mb-3">No addresses saved</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn-primary btn-sm"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-accent bg-accent/10"
                            : "border-nexus-600 hover:border-nexus-500"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 accent-accent"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-nexus-50 text-sm">
                                {addr.full_name}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-nexus-700 rounded text-nexus-300">
                                {addr.address_type}
                              </span>
                            </div>
                            <p className="text-xs text-nexus-400 mt-1">
                              {addr.house_number}, {addr.area}
                              {addr.landmark && `, ${addr.landmark}`}
                            </p>
                            <p className="text-xs text-nexus-400">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-xs text-nexus-300 mt-1">
                              {addr.phone}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Address Form Modal */}
              {showAddressForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-nexus-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-xl font-bold text-nexus-50">
                        Add New Address
                      </h3>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="p-2 hover:bg-nexus-700 rounded-lg transition-colors"
                      >
                        <HiOutlineX className="w-5 h-5 text-nexus-400" />
                      </button>
                    </div>

                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm text-nexus-300 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            minLength={2}
                            value={newAddress.full_name}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, full_name: e.target.value })
                            }
                            className="input w-full"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm text-nexus-300 mb-1">
                            Phone * (10 digits)
                          </label>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            maxLength={10}
                            value={newAddress.phone}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '') })
                            }
                            className="input w-full"
                            placeholder="9876543210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-nexus-300 mb-1">
                          House/Flat/Office No. *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.house_number}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, house_number: e.target.value })
                          }
                          className="input w-full"
                          placeholder="123, Building Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-nexus-300 mb-1">
                          Area/Street *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.area}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, area: e.target.value })
                          }
                          className="input w-full"
                          placeholder="Street name, Area"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-nexus-300 mb-1">
                          Landmark
                        </label>
                        <input
                          type="text"
                          value={newAddress.landmark}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, landmark: e.target.value })
                          }
                          className="input w-full"
                          placeholder="Near..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-nexus-300 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, city: e.target.value })
                            }
                            className="input w-full"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-nexus-300 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={newAddress.state}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, state: e.target.value })
                            }
                            className="input w-full"
                            placeholder="State"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-nexus-300 mb-1">
                            Pincode * (6 digits)
                          </label>
                          <input
                            type="text"
                            required
                            pattern="[1-9][0-9]{5}"
                            maxLength={6}
                            value={newAddress.pincode}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '') })
                            }
                            className="input w-full"
                            placeholder="380001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-nexus-300 mb-1">
                            Address Type
                          </label>
                          <select
                            value={newAddress.address_type}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, address_type: e.target.value })
                            }
                            className="input w-full"
                          >
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingAddress}
                          className="btn-primary flex-1"
                        >
                          {savingAddress ? "Saving..." : "Save Address"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="card p-6 sticky top-24">
                <h2 className="font-heading text-xl font-bold text-nexus-50 mb-6">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-3 pb-4 border-b border-nexus-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-nexus-300">
                      Subtotal ({itemCount} items)
                    </span>
                    <span className="text-nexus-100">
                      ₹{totalMRP.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-nexus-300">Discount</span>
                      <span className="text-status-success">
                        -₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-nexus-300">Shipping</span>
                    <span className="text-status-success">Free</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline py-4 border-b border-nexus-600">
                  <span className="font-medium text-nexus-100">Total</span>
                  <div className="text-right">
                    <span className="font-heading text-2xl font-bold text-accent">
                      ₹{subtotal.toLocaleString()}
                    </span>
                    {discount > 0 && (
                      <p className="text-xs text-status-success">
                        You save ₹{discount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={placeOrder}
                  disabled={placingOrder || cartItems.length === 0 || !selectedAddressId}
                  className="btn-primary w-full btn-lg mt-6 relative overflow-hidden"
                >
                  <span
                    className={`flex items-center justify-center gap-2 transition-opacity ${
                      placingOrder ? "opacity-0" : ""
                    }`}
                  >
                    Place Order
                    <HiOutlineArrowRight className="w-5 h-5" />
                  </span>
                  {placingOrder && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-nexus-900 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>

                {!selectedAddressId && addresses.length === 0 && (
                  <p className="text-xs text-status-warning text-center mt-2">
                    Please add a delivery address to place order
                  </p>
                )}

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-nexus-600 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-nexus-300">
                    <HiOutlineTruck className="w-5 h-5 text-accent" />
                    <span>Fast dispatch across Gujarat</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-nexus-300">
                    <HiOutlineShieldCheck className="w-5 h-5 text-accent" />
                    <span>100% genuine products</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-nexus-300">
                    <HiOutlineReceiptRefund className="w-5 h-5 text-accent" />
                    <span>Wholesale rates guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Continue Shopping */}
        <div className="mt-8 sm:hidden">
          <Link
            to="/"
            className="btn-secondary w-full justify-center"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
