import passport from 'passport';

// Autenticación con JWT sin sesiones
export const authenticateJWT = passport.authenticate('jwt', { session: false });

// Autorización por roles permitidos (roles es un array)
export const authorizeRole = (roles = []) => (req, res, next) => {
  if (!req.user) {
    // No está autenticado
    return res.status(401).json({ status: 'error', message: 'No autenticado' });
  }

  if (!roles.includes(req.user.role)) {
    // No tiene rol permitido
    return res.status(403).json({
      status: 'error',
      message: `Acceso denegado: solo para roles permitidos [${roles.join(', ')}]`
    });
  }

  // Usuario autenticado y autorizado
  next();
};
