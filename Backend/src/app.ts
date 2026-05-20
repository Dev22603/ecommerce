import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes";
import { config } from "./constants/config";
import { requestLogger } from "./middlewares/logging";
import logger from "./lib/logger";

const app = express();

app.use(
	cors({
		origin: config.FRONTEND_URL,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(express.static("uploads"));

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "Server is Up and Running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);

const uploadsDir = path.resolve("uploads");
app.use("/api/uploads", express.static(uploadsDir));

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	logger.error("Unhandled server error", { error: err.message, stack: err.stack });
	res.status(500).json({ message: "Internal server error" });
});

export { app };
