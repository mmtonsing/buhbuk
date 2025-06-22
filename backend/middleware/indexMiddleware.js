import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

const applyMiddleware = (app) => {
  // Enables frontend–backend communication with credentials (cookies)
  app.use(
    cors({
      origin: process.env.CLIENT_URL, // your frontend URL
      credentials: true,
    })
  );

  app.use(cookieParser()); // Parses cookies (for reading JWT)
  app.use(express.json()); // Parses incoming JSON
  app.use(passport.initialize()); // Initializes passport
};

export default applyMiddleware;
