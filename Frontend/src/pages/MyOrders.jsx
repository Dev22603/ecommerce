import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services/ordersService";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  HiOutlineShoppingBag,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlinePhotograph,
} from "react-icons/hi";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const fetchOrders = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await orderService.getUserOrders(user.token, pageNum);
      const { orders, total_pages } = response;
      setOrders(orders);
      setTotalPages(total_pages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders(page);
    }
  }, [user, page]);

  const handleCancelOrder = async (orderId) => {
    setCancellingOrder(orderId);
    try {
      await orderService.cancelOrder(user.token, orderId);
      toast.success("Order cancelled successfully");
      fetchOrders(page);
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "text-status-warning",
        bg: "bg-status-warning/10",
        border: "border-status-warning/30",
        icon: HiOutlineClock,
        label: "Pending",
      },
      delivered: {
        color: "text-status-info",
        bg: "bg-status-info/10",
        border: "border-status-info/30",
        icon: HiOutlineTruck,
        label: "Shipped",
      },
      completed: {
        color: "text-status-success",
        bg: "bg-status-success/10",
        border: "border-status-success/30",
        icon: HiOutlineCheck,
        label: "Completed",
      },
      cancelled: {
        color: "text-status-error",
        bg: "bg-status-error/10",
        border: "border-status-error/30",
        icon: HiOutlineX,
        label: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Empty State
  if (!loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-nexus-900">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-nexus-800 rounded-2xl mb-6">
              <HiOutlineShoppingBag className="w-12 h-12 text-nexus-400" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-nexus-50 mb-4">
              No orders yet
            </h1>
            <p className="text-nexus-300 mb-8 max-w-md mx-auto">
              You haven&apos;t placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Link to="/" className="btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexus-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-nexus-50">
            My Orders
          </h1>
          <p className="text-nexus-300 mt-1">
            Track and manage your orders
          </p>
        </div>

        {loading ? (
          // Loading Skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-nexus-800/40 rounded-2xl p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-nexus-700 rounded w-32" />
                    <div className="h-3 bg-nexus-700 rounded w-24" />
                  </div>
                  <div className="h-6 bg-nexus-700 rounded w-20" />
                </div>
                <div className="h-16 bg-nexus-700/50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedOrder === order.order_id;

                return (
                  <div
                    key={order.order_id}
                    className="card overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Order Header */}
                    <div
                      className="p-4 sm:p-6 cursor-pointer hover:bg-nexus-700/20 transition-colors"
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.order_id)
                      }
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-heading font-semibold text-nexus-50">
                              Order #{order.order_id}
                            </h3>
                            <span
                              className={`badge ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-nexus-300">
                            <span>{formatDate(order.created_at)}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{formatTime(order.created_at)}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {order.order_items?.length || 0}{" "}
                              {order.order_items?.length === 1
                                ? "item"
                                : "items"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-heading text-xl font-bold text-accent">
                              ₹{Number(order.total_amount).toLocaleString()}
                            </p>
                          </div>
                          <div className="p-2 text-nexus-400">
                            {isExpanded ? (
                              <HiOutlineChevronUp className="w-5 h-5" />
                            ) : (
                              <HiOutlineChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      {!isExpanded && order.order_items?.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
                          {order.order_items.slice(0, 4).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-12 bg-nexus-700/30 rounded-lg flex-shrink-0 overflow-hidden"
                            >
                              {item.images?.[0] ? (
                                <img
                                  src={`http://localhost:5000/api${item.images[0]}`}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <HiOutlinePhotograph className="w-5 h-5 text-nexus-500" />
                                </div>
                              )}
                            </div>
                          ))}
                          {order.order_items.length > 4 && (
                            <div className="w-12 h-12 bg-nexus-700/50 rounded-lg flex-shrink-0 flex items-center justify-center">
                              <span className="text-xs text-nexus-300">
                                +{order.order_items.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expanded Order Details */}
                    {isExpanded && (
                      <div className="border-t border-nexus-600/50 animate-fade-in">
                        {/* Order Timeline */}
                        <div className="p-4 sm:p-6 bg-nexus-800/30">
                          <h4 className="text-sm font-medium text-nexus-200 mb-4">
                            Order Status
                          </h4>
                          <div className="flex items-center gap-2">
                            {[
                              { value: "pending", label: "Pending" },
                              { value: "delivered", label: "Shipped" },
                              { value: "completed", label: "Completed" },
                            ].map((step, idx) => {
                              const stepConfig = getStatusConfig(step.value);
                              const StepIcon = stepConfig.icon;
                              const isActive =
                                order.status === step.value ||
                                (step.value === "pending" &&
                                  order.status !== "cancelled") ||
                                (step.value === "delivered" &&
                                  (order.status === "delivered" ||
                                    order.status === "completed")) ||
                                (step.value === "completed" &&
                                  order.status === "completed");
                              const isCancelled = order.status === "cancelled";

                              return (
                                <React.Fragment key={step.value}>
                                  <div
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                      isCancelled
                                        ? "opacity-30"
                                        : isActive
                                          ? `${stepConfig.bg} ${stepConfig.color}`
                                          : "bg-nexus-700/30 text-nexus-400"
                                    }`}
                                  >
                                    <StepIcon className="w-4 h-4" />
                                    <span className="text-xs font-medium hidden sm:inline">
                                      {step.label}
                                    </span>
                                  </div>
                                  {idx < 2 && (
                                    <div
                                      className={`flex-1 h-0.5 ${
                                        isCancelled
                                          ? "bg-nexus-600/30"
                                          : isActive
                                            ? "bg-accent/50"
                                            : "bg-nexus-600"
                                      }`}
                                    />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 sm:p-6">
                          <div className="space-y-3">
                            {order.order_items?.map((item, idx) => {
                              const hasDiscount = item.mrp && item.mrp > item.sales_price;
                              const itemTotal = item.quantity * item.sales_price;

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-3 bg-nexus-700/20 rounded-xl"
                                >
                                  <div className="w-14 h-14 bg-nexus-700/30 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.images?.[0] ? (
                                      <img
                                        src={`http://localhost:5000/api${item.images[0]}`}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <HiOutlinePhotograph className="w-5 h-5 text-nexus-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-nexus-50 text-sm truncate">
                                      {item.product_name}
                                    </h5>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-nexus-400">
                                      <span>Qty: {item.quantity}</span>
                                      <span>×</span>
                                      <span>₹{Number(item.sales_price).toLocaleString()}</span>
                                      {hasDiscount && (
                                        <span className="line-through text-nexus-500">
                                          ₹{Number(item.mrp).toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="font-semibold text-nexus-50">
                                      ₹{itemTotal.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Summary */}
                          <div className="mt-4 pt-4 border-t border-nexus-600/30">
                            {(() => {
                              const items = order.order_items || [];
                              const totalMRP = items.reduce(
                                (sum, item) => sum + item.quantity * (item.mrp || item.sales_price),
                                0
                              );
                              const discount = totalMRP - Number(order.total_amount);

                              return (
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-nexus-400">
                                    {discount > 0 && (
                                      <span className="text-status-success mr-2">
                                        Saved ₹{discount.toLocaleString()}
                                      </span>
                                    )}
                                    <span>Free Shipping</span>
                                  </div>
                                  <div className="text-right">
                                    {discount > 0 && (
                                      <span className="text-sm text-nexus-500 line-through mr-2">
                                        ₹{totalMRP.toLocaleString()}
                                      </span>
                                    )}
                                    <span className="font-heading text-xl font-bold text-accent">
                                      ₹{Number(order.total_amount).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Order Actions */}
                        {order.status === "pending" && (
                          <div className="p-4 sm:p-6 border-t border-nexus-600/50 bg-nexus-800/20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(order.order_id);
                              }}
                              disabled={cancellingOrder === order.order_id}
                              className="btn-danger btn-sm"
                            >
                              {cancellingOrder === order.order_id ? (
                                <div className="w-4 h-4 border-2 border-status-error border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <HiOutlineX className="w-4 h-4" />
                                  Cancel Order
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="pagination-btn pagination-btn-inactive disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>

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
                          <span key={i} className="w-10 text-center text-nexus-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setPage(pageNum)}
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
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="pagination-btn pagination-btn-inactive disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
