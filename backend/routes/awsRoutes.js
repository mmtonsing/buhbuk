const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const awsController = require("../controllers/awsRoutes");

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
