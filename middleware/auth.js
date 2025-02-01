// middleware/auth.js

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  }
  // User is not authenticated, redirect to the login page
  res.redirect('/auth/login');
}
