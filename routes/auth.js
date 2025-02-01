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

// Registration Handler
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Create new user
    await User.create({ username, password });
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration Error:', error);
    res.redirect('/auth/register');
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
