const passport = require('passport');

// Middleware para autenticar con JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware para autorizar por rol
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ status: 'error', message: 'Acceso denegado: solo para ' + role });
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRole
};
