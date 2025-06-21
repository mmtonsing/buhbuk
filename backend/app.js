<<<<<<< HEAD
const express = require("express");
require("./config/passport"); // Initialize passport
const applyMiddleware = require("./middleware"); // Modular middleware
const { mod3dRoutes, userRoutes, fileRoutes } = require("./routes"); //Load Routes
=======
import express from "express";
import "./config/passport.js"; // Initialize passport
import applyMiddleware from "./middleware/index.js"; // Modular middleware
import { mod3dRoutes, userRoutes, fileRoutes } from "./routes/index.js";
import { globalLimiter } from "./middleware/rateLimit.js";
>>>>>>> 497afeb (shifting backend to esm)

const app = express(); // Creates Express app

app.set("trust proxy", 1);

// MIDDLEWARES - cookieParser, multer, CORS, passport, etc.
applyMiddleware(app);

<<<<<<< HEAD
//Route Mounting
app.use("/mod3ds", mod3dRoutes); //CRUD for model metadata (title, description, etc.)
app.use("/user", userRoutes); //Login, register, get logged-in user, logout
app.use("/file", fileRoutes); //Upload/download actual files to AWS
=======
// Route Mounting
app.use("/mod3ds", mod3dRoutes);
app.use("/user", userRoutes);
app.use("/file", fileRoutes);
>>>>>>> 497afeb (shifting backend to esm)

// Health check route
app.get("/", (req, res) => {
  res.send("Hawkdak Pa");
});

// Global rate limiter
app.use(globalLimiter);

export default app;
