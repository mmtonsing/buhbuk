import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(
    { usernameField: "identifier", passwordField: "password" },
    async (identifier, password, done) => {
      try {
        // Find user by username OR email
        const user =
          (await User.findOne({ username: identifier })) ||
          (await User.findOne({ email: identifier }));

        if (!user) {
          return done(null, false, {
            message: "No user found with that username/email",
          });
        }

        // Use passport-local-mongoose's .authenticate()
        const authenticated = await user.authenticate(password);

        if (authenticated.error) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
