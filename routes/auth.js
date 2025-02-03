// routes/auth.js

import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// Registration Page
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    bodyClass: '',
    includeFooter: false,
    user: req.user,
  });
});

// Register route for normal users
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if the username already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
          return res.status(400).send('Username already exists');
      }

      // Create a new user with the role of 'user'
      const user = await User.create({ username, password, role: 'user' });
      res.redirect('/auth/login');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error registering user');
  }
});


// Login Page
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    bodyClass: '',
    includeFooter: false,
    user: req.user,
  });
});

// Login Handler
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/', // Redirect to homepage on success
    failureRedirect: '/auth/login', // Redirect back to login on failure
  })
);

// Logout Handler
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/login');
  });
});

export default router;
