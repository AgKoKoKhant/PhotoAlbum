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
        req.flash('error', 'Username already exists');
        return res.redirect('/auth/register');
      }

      // Create a new user with the role of 'user'
  const user = await User.create({ username, password, role: 'user' });
  req.flash('success', 'Registration successful. Please log in.');
  return res.redirect("/auth/login");

} 

catch (err) {
  console.error(err);
  req.flash("error", "Registration failed. Please try again.");
  return res.redirect("/auth/register");
}
});


// Login Page
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    bodyClass: '',
    includeFooter: false,
    user: req.user,
    successMessage: req.flash('success'),  
    errorMessage: req.flash('error'),
  });
});

// Login Handler
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true  // Enable flash messages on failure
  }),
  (req, res) => {
    
    req.flash('success', 'You are now logged in!');
    console.log('Login successful!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    res.redirect('/');
  }
);

// Logout Handler
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You have been logged out!');
    console.log('success', 'You have been logged out!');
    res.redirect('/auth/login');
  });
});


export default router;
