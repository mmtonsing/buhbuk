const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const passport = require("passport");

const isProduction = process.env.NODE_ENV === "production";
const upload = multer();

const applyMiddleware = (app) => {
  app.use(cookieParser()); //parses the cookie from incoming requests (for reading JWT).
  app.use(upload.any()); //upload files (via multer).

  //enables frontend–backend communication with credentials (cookies)
  app.use(
    cors({
      origin: isProduction ? process.env.CLIENT_URL : "http://localhost:5173", // your frontend URL
      credentials: true,
    })
  );
  app.use(express.json()); //parses incoming JSON bodies.
  app.use(passport.initialize()); //passport strategy for login.
};

module.exports = applyMiddleware;
