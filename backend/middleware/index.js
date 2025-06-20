const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const passport = require("passport");

const upload = multer();

const applyMiddleware = (app) => {
  //enables frontend–backend communication with credentials (cookies)
  app.use(
    cors({
      origin: process.env.CLIENT_URL, // your frontend URL
      credentials: true,
    })
  );

  app.use(cookieParser()); //parses the cookie from incoming requests (for reading JWT).
  app.use(upload.any()); //upload files (via multer).

  app.use(express.json()); //parses incoming JSON bodies.
  app.use(passport.initialize()); //passport strategy for login.
};

module.exports = applyMiddleware;
