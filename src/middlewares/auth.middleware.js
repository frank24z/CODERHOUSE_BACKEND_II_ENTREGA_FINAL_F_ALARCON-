import passport from 'passport';


export const authenticateJWT = passport.authenticate('jwt', { session: false });


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


  next();
};
