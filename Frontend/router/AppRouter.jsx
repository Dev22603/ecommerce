// src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
import ManageProducts from "../pages/ManageProducts";
import ManageUsers from "../pages/ManageUsers";
import Cart from "../pages/Cart";
import OrderSummary from "../pages/OrderSummary";
import ProtectedRoute from "./ProtectedRoute"; // Custom route protection component
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const AppRouter = () => {
  const { user } = useContext(AuthContext); // Access authentication state

  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/cart" component={Cart} />
        <Route path="/order-summary" component={OrderSummary} />

        {/* Protected Routes for Admin */}
        <ProtectedRoute
          path="/admin/dashboard"
          component={AdminDashboard}
          allowedRoles={["admin"]}
        />
        <ProtectedRoute
          path="/admin/manage-products"
          component={ManageProducts}
          allowedRoles={["admin"]}
        />
        <ProtectedRoute
          path="/admin/manage-users"
          component={ManageUsers}
          allowedRoles={["admin"]}
        />
        
        {/* Redirect to home if no route matched */}
        <Route path="*" render={() => <div>404 - Page Not Found</div>} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
