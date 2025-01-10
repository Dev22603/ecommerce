// app.js (App Setup)
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/user.routes.mjs';
import productRoutes from './routes/product.routes.mjs';
import cors from 'cors';
const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Allow this frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials if needed
  }));
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export {app};  // Export the app for use in index.js
// export default app;  // Export the app for use in index.js
