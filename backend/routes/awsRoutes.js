import express from "express";
import authMiddleware from "../middleware/auth.js";
import * as awsController from "../controllers/awsRoutes.js";

const router = express.Router();

<<<<<<< HEAD
//Retrieve a file from S3 and return base64 string for rendering
router.get("/public/:id", awsController.retrievePublicFile);

router.post("/zip", authMiddleware, awsController.uploadZipAndExtract);

//  Stream video instead of base64
router.get("/stream/:id", awsController.streamFile);

//Retrieve a file from S3 and return base64 string for rendering
router.get("/:id", authMiddleware, awsController.retrieveFile);

//Upload a 3D model file to S3
router.post("/", authMiddleware, awsController.uploadFile);

module.exports = router;
=======
// Retrieve a file from S3 and return base64 string for rendering (public)
router.get("/public/:id", awsController.retrievePublicFile);

// Upload a .zip file, extract and store contents in S3
router.post("/zip", authMiddleware, awsController.uploadZipAndExtract);

// Stream a video file instead of returning base64
router.get("/stream/:id", awsController.streamFile);

// Retrieve a file (auth-protected)
router.get("/:id", authMiddleware, awsController.retrieveFile);

// Upload a single file (auth-protected)
router.post("/", authMiddleware, awsController.uploadFile);

export default router;
>>>>>>> 497afeb (shifting backend to esm)
