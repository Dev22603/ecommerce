// routes/authRoutes.js
import express from "express";
import { signup, login, getAllUsers } from '../controllers/user.controllers.mjs';

const router = express.Router();

// Sign up route
router.post("/signup", signup);

// Login route
router.post('/login', login);
router.get('/users', getAllUsers);

export default router;
