const express = require("express");
require("./config/passport"); // Initialize passport
const applyMiddleware = require("./middleware"); // Modular middleware
const { mod3dRoutes, userRoutes, imageRoutes } = require("./routes"); //Load Routes

const app = express(); //Creates Express app

app.set("trust proxy", 1);
//MIDDLE WARES- cookieParser, multer, CORS, passport)
applyMiddleware(app);

//Route Mounting
app.use("/mod3ds", mod3dRoutes); //CRUD for model metadata (title, description, etc.)
app.use("/user", userRoutes); //Login, register, get logged-in user, logout
app.use("/images", imageRoutes); //Upload/download actual files to AWS

app.get("/", (req, res) => {
  res.send("Hawkdak Pa");
});

const { globalLimiter } = require("./middleware/rateLimit");
app.use(globalLimiter); // Applies to all routes

module.exports = app;
