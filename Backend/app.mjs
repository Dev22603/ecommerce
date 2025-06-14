// app.js (App Setup)
import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/user.routes.mjs";
import productRoutes from "./routes/product.routes.mjs"; //Temporary solution
import cartRoutes from "./routes/cart.routes.mjs";
import orderRoutes from "./routes/order.routes.mjs";
import addressRoutes from "./routes/address.routes.mjs";
import cors from "cors";
import path from "path";

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173", // Allow this frontend origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // Allow credentials if needed
    })
);
// Middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// Routes
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);

// Serve static files from uploads folder
const uploadsDir = path.resolve("uploads"); // Resolve the absolute path
app.use("/api/uploads", express.static(uploadsDir));

export { app }; // Export the app for use in index.js
