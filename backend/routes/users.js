const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const authMiddleware = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimit");

router
  .route("/")
  .get(authMiddleware, users.getAllUsers) //Get all users/
  .post(users.createUser); //Create user

//always keep the route "/me" above "/:id"
//Gets user info from JWT (cookie)
router.get("/me", authMiddleware, users.getUserInfo);

router.get("/:id/posts", users.getUserPosts);

router
  .route("/:id")
  .get(authMiddleware, users.retrieveUser) //Retrieve a user
  .put(authMiddleware, users.editUser) //Edit a user
  .delete(authMiddleware, users.deleteUser); //Delete a user

// Login and set HTTP-only cookie
router.post("/login", loginLimiter, users.loginUser);

//logout Clears cookie
router.post("/logout", authMiddleware, users.logoutUser);

module.exports = router;
