// middleware/auth.js
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/auth/login');
};

export const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
  }
  res.status(403).send('Access denied. Only admins can perform this action.');
};