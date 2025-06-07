import passport from 'passport';

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export const authorizeRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'No autenticado' });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ status: 'error', message: `Acceso denegado: solo para ${role}` });
  }
  next();
};
