// config/passportConfig.js

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find the user by username
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      // Validate password
      // const isMatch = await user.isValidPassword(password);
      console.log("User found:", user);
console.log("Stored Hashed Password:", user.password);
console.log("Entered Password:", password);

if (!user.isValidPassword) {
    console.error("Error: isValidPassword is not defined on user.");
}

const isMatch = await user.isValidPassword(password);
console.log("Password Match:", isMatch);

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from stored session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;
