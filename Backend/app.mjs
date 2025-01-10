// app.js (App Setup)
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/user.routes.mjs';
import productRoutes from './routes/product.routes.mjs';

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export {app};  // Export the app for use in index.js
// export default app;  // Export the app for use in index.js
