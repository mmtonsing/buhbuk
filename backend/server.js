if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./app");
const connectDB = require("./utils/database");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB or start server:", err.message);
  });
