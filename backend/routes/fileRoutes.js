import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import * as awsController from "../controllers/fileController.js";

const router = express.Router();
const upload = multer();

// ✅ Public routes (non-auth, non-destructive)
router.get("/public/:id", awsController.getPublicFile); // Base64 image
router.get("/raw/*splat", awsController.streamAnyFile); // Wildcard stream
router.get("/stream/:id", awsController.streamFile); // Video stream

// Auth-protected base64 fetch
router.get("/:id", authMiddleware, awsController.getFile);

// ✅ Upload (image/video/model)
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  awsController.createFile
);

// ✅ Upload and extract zip
router.post(
  "/zip",
  authMiddleware,
  upload.single("file"),
  awsController.uploadZipAndExtract
);

export default router;
