const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { deleteFileFromS3 } = require("../utils/s3");

const s3Bucket = "bukwarm";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

//Retrieve a file from S3 and return base64 string for rendering
module.exports.retrieveFile = async (req, res) => {
  const id = req.params.id;
  const bucketParams = {
    Bucket: s3Bucket,
    Key: id,
  };

  const data = await s3Client.send(new GetObjectCommand(bucketParams));

  const contentType = data.ContentType;
  const srcString = await data.Body.transformToString("base64");
  const imageSource = `data:${contentType};base64, ${srcString}`;

  res.json(imageSource);
};

//Upload a 3D model file to S3
module.exports.uploadFile = async (req, res) => {
  const file = req.files[0];
  console.log(file);
  const bucketParams = {
    Bucket: s3Bucket,
    Key: file.originalname,
    Body: file.buffer,
  };
  const data = await s3Client.send(new PutObjectCommand(bucketParams));
  res.json(data);
};

//Retrieve a file from S3 and return base64 string for rendering
module.exports.retrievePublicFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = {
      Bucket: s3Bucket,
      Key: id,
    };
    const data = await s3Client.send(new GetObjectCommand(bucketParams));

    const contentType = data.ContentType;
    const srcString = await data.Body.transformToString("base64");
    const imageSource = `data:${contentType};base64, ${srcString}`;
    console.log("Trying to fetch key:", id); // e.g. "captain.png"

    res.send(imageSource);
  } catch (err) {
    console.error("S3 fetch error:", err.name, err.message);
    return res.status(404).json({ error: "Image not found in S3" });
  }
};

//Delete File
module.exports.deleteFile = async (req, res) => {
  module.exports.deleteFile = async (req, res) => {
    try {
      const result = await deleteFileFromS3(req.params.id);
      res.json(result);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to delete from S3", details: err.message });
    }
  };
};
