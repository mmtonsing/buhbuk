import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

const applyMiddleware = (app) => {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(passport.initialize());
};

export default applyMiddleware;
