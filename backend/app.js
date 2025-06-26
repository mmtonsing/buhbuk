import express from "express";
import "./config/passport.js";
import applyMiddleware from "./middleware/indexMiddleware.js";
import {
  mod3dRoutes,
  userRoutes,
  fileRoutes,
  postRoutes,
} from "./routes/index.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import maintenanceRouter from "./routes/maintenanceRouter.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import "./models/index.js";

const app = express();
app.set("trust proxy", 1);

// 🔐 Global middleware
applyMiddleware(app);
app.use(globalLimiter); // Can come before or after applyMiddleware

// 🌐 Route Mounting
app.use("/maintenance", maintenanceRouter);
app.use("/mod3ds", mod3dRoutes);
app.use("/user", userRoutes);
app.use("/file", fileRoutes);
app.use("/posts", postRoutes);

// 🔍 Default route
app.get("/", (req, res) => {
  res.send("Our Buk is Warm");
});

// ❌ Optional catch-all 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ❗ Global error handler (always last)
app.use(globalErrorHandler);

export default app;
