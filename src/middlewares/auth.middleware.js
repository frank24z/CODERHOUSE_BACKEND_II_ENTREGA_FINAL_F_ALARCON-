import passport from 'passport';

// Middleware para autenticar JWT (sin sesiones)
export const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware para autorizar acceso según roles permitidos
// roles es un array de strings, ej: ['user', 'admin1']
export const authorizeRole = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'No autenticado' });
  }
  
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      status: 'error',
      message: `Acceso denegado: solo para roles permitidos [${roles.join(', ')}]`
    });
  }

  // Usuario autorizado, continuar
  next();
};
