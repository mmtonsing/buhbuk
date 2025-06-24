import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import * as awsController from "../controllers/awsController.js";

const router = express.Router();
const upload = multer();

// Public base64 fetch
router.get("/public/:id", awsController.retrievePublicFile);

// Public binary stream
router.get("/raw/*splat", awsController.streamAnyFile);

// Video stream
router.get("/stream/:id", awsController.streamFile);

// Auth-protected base64 fetch
router.get("/:id", authMiddleware, awsController.retrieveFile);

// Auth-protected upload
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  awsController.uploadFile
);

// Zip upload + extract
router.post(
  "/zip",
  authMiddleware,
  upload.single("file"),
  awsController.uploadZipAndExtract
);

export default router;
