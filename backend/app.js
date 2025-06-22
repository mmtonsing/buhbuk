import express from "express";
import "./config/passport.js"; // Initialize passport
import applyMiddleware from "./middleware/indexMiddleware.js"; // Modular middleware
import {
  mod3dRoutes,
  userRoutes,
  fileRoutes,
  postRoutes,
} from "./routes/index.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import "./models/index.js"; // ⬅️ This registers all category models globally

const app = express(); // Creates Express app

app.set("trust proxy", 1);

// MIDDLEWARES - cookieParser, multer, CORS, passport, etc.
applyMiddleware(app);

//Route Mounting
app.use("/mod3ds", mod3dRoutes); //CRUD for model metadata (title, description, etc.)
app.use("/user", userRoutes); //Login, register, get logged-in user, logout
app.use("/file", fileRoutes); //Upload/download actual files to AWS
app.use("/posts", postRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Hawkdak Pa");
});

// Global rate limiter
app.use(globalLimiter);

export default app;
