import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services/ordersService";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCurrencyRupee,
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineArrowLeft,
  HiOutlineRefresh,
  HiOutlineChevronDown,
} from "react-icons/hi";

const AllOrders = () => {
  const { user } = useContext(AuthContext);
  const [ordersData, setOrdersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [salesSummary, setSalesSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [productSummary, setProductSummary] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const token = user?.token;

  const fetchAllOrders = async (page) => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders(token, page);

      const allOrders = data.users.flatMap((user) =>
        user.orders.map((order) => ({
          ...order,
          user_name: user.user_name,
        }))
      );

      setOrdersData(allOrders);
      setTotalPages(data.totalPages);

      // Calculate summaries
      const totalRevenue = allOrders.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      );
      const totalOrders = allOrders.length;

      const productCounts = {};
      allOrders.forEach((order) => {
        order.order_items.forEach((item) => {
          productCounts[item.product_name] =
            (productCounts[item.product_name] || 0) + item.quantity;
        });
      });

      const productSummaryData = Object.entries(productCounts)
        .map(([productName, quantitySold]) => ({
          productName,
          quantitySold,
        }))
        .sort((a, b) => b.quantitySold - a.quantitySold);

      setSalesSummary({ totalRevenue, totalOrders });
      setProductSummary(productSummaryData);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await orderService.updateOrderStatus(token, orderId, newStatus);
      setOrdersData((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders(currentPage);
    }
  }, [token, currentPage]);

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

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "delivered", label: "Shipped" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-nexus-900">
      {/* Header */}
      <div className="bg-nexus-850 border-b border-nexus-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin-dashboard"
                className="p-2 text-nexus-400 hover:text-accent hover:bg-nexus-700/50 rounded-lg transition-colors"
              >
                <HiOutlineArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-nexus-50">
                  All Orders
                </h1>
                <p className="text-nexus-300 mt-1">
                  Manage and track all customer orders
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchAllOrders(currentPage)}
              className="btn-secondary"
            >
              <HiOutlineRefresh className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value text-accent">
                  ₹{salesSummary.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <HiOutlineCurrencyRupee className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{salesSummary.totalOrders}</p>
              </div>
              <div className="p-3 bg-status-info/10 rounded-xl">
                <HiOutlineShoppingBag className="w-6 h-6 text-status-info" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Products Sold</p>
                <p className="stat-value">
                  {productSummary.reduce((sum, p) => sum + p.quantitySold, 0)}
                </p>
              </div>
              <div className="p-3 bg-status-success/10 rounded-xl">
                <HiOutlineCube className="w-6 h-6 text-status-success" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Avg. Order Value</p>
                <p className="stat-value">
                  ₹
                  {salesSummary.totalOrders > 0
                    ? Math.round(
                        salesSummary.totalRevenue / salesSummary.totalOrders
                      ).toLocaleString()
                    : 0}
                </p>
              </div>
              <div className="p-3 bg-status-warning/10 rounded-xl">
                <HiOutlineCurrencyRupee className="w-6 h-6 text-status-warning" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-4 border-b border-nexus-600/50">
                <h2 className="font-heading text-lg font-semibold text-nexus-50">
                  Orders
                </h2>
              </div>

              {loading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-nexus-700/20 rounded-xl animate-pulse"
                    >
                      <div className="flex justify-between mb-3">
                        <div className="h-4 bg-nexus-600 rounded w-32" />
                        <div className="h-6 bg-nexus-600 rounded w-24" />
                      </div>
                      <div className="h-3 bg-nexus-600 rounded w-48" />
                    </div>
                  ))}
                </div>
              ) : ordersData.length === 0 ? (
                <div className="p-12 text-center">
                  <HiOutlineShoppingBag className="w-12 h-12 text-nexus-500 mx-auto mb-4" />
                  <p className="text-nexus-300">No orders found</p>
                </div>
              ) : (
                <div className="divide-y divide-nexus-600/50">
                  {ordersData.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    const isExpanded = expandedOrder === order.order_id;

                    return (
                      <div
                        key={order.order_id}
                        className="p-4 hover:bg-nexus-700/20 transition-colors"
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            setExpandedOrder(
                              isExpanded ? null : order.order_id
                            )
                          }
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-nexus-700/50 rounded-lg">
                                <HiOutlineUser className="w-5 h-5 text-nexus-300" />
                              </div>
                              <div>
                                <p className="font-medium text-nexus-50">
                                  {order.user_name}
                                </p>
                                <p className="text-xs text-nexus-400">
                                  Order #{order.order_id} •{" "}
                                  {formatDate(order.created_at)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <p className="font-heading font-bold text-accent">
                                ₹{Number(order.total_amount).toLocaleString()}
                              </p>

                              {/* Status Dropdown */}
                              <div className="relative">
                                <select
                                  value={order.status}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(
                                      order.order_id,
                                      e.target.value
                                    );
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  disabled={updatingOrderId === order.order_id}
                                  className={`appearance-none px-3 py-1.5 pr-8 text-xs font-medium rounded-lg border cursor-pointer
                                    ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}
                                    focus:outline-none focus:ring-2 focus:ring-accent/30
                                    disabled:opacity-50 disabled:cursor-wait`}
                                >
                                  {statusOptions.map((opt) => (
                                    <option
                                      key={opt.value}
                                      value={opt.value}
                                      className="bg-nexus-800 text-nexus-100"
                                    >
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <HiOutlineChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Order Items */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-nexus-600/50 animate-fade-in">
                            <p className="text-xs text-nexus-400 mb-2">
                              Order Items ({order.order_items.length})
                            </p>
                            <div className="space-y-2">
                              {order.order_items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 bg-nexus-700/20 rounded-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-nexus-100">
                                      {item.product_name}
                                    </span>
                                    <span className="text-xs text-nexus-400">
                                      x{item.quantity}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-nexus-100">
                                    ₹
                                    {(
                                      item.quantity * item.sales_price
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-nexus-600/50">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn pagination-btn-inactive disabled:opacity-30"
                    >
                      <HiOutlineChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-sm text-nexus-300 px-4">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn pagination-btn-inactive disabled:opacity-30"
                    >
                      <HiOutlineChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Products Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Top Products */}
            <div className="card">
              <div className="p-4 border-b border-nexus-600/50">
                <h3 className="font-heading font-semibold text-nexus-50">
                  Top Selling Products
                </h3>
              </div>
              <div className="p-4">
                {productSummary.length === 0 ? (
                  <p className="text-sm text-nexus-400">No data available</p>
                ) : (
                  <div className="space-y-3">
                    {productSummary.slice(0, 8).map((product, index) => (
                      <div
                        key={product.productName}
                        className="flex items-center gap-3"
                      >
                        <span className="w-6 h-6 bg-nexus-700 rounded-lg flex items-center justify-center text-xs font-medium text-nexus-300">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-nexus-100 truncate">
                            {product.productName}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-accent">
                          {product.quantitySold}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="card">
              <div className="p-4 border-b border-nexus-600/50">
                <h3 className="font-heading font-semibold text-nexus-50">
                  Status Breakdown
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {statusOptions.map((opt) => {
                  const count = ordersData.filter(
                    (o) => o.status === opt.value
                  ).length;
                  const config = getStatusConfig(opt.value);
                  const StatusIcon = config.icon;
                  const percentage =
                    ordersData.length > 0
                      ? Math.round((count / ordersData.length) * 100)
                      : 0;

                  return (
                    <div key={opt.value}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${config.color}`} />
                          <span className="text-sm text-nexus-200">
                            {opt.label}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-nexus-100">
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-nexus-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            opt.value === "pending"
                              ? "bg-status-warning"
                              : opt.value === "delivered"
                                ? "bg-status-info"
                                : opt.value === "completed"
                                  ? "bg-status-success"
                                  : "bg-status-error"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
