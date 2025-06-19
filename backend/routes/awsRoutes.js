const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const awsController = require("../controllers/awsRoutes");

//Retrieve a file from S3 and return base64 string for rendering
router.get("/:id", authMiddleware, awsController.retrieveFile);

//Upload a 3D model file to S3
router.post("/", authMiddleware, awsController.uploadFile);

//Retrieve a file from S3 and return base64 string for rendering
router.get("/public/:id", awsController.retrievePublicFile);

module.exports = router;
