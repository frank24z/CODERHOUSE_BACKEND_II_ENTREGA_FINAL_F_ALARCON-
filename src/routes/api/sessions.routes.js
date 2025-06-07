import { Router } from 'express';
import passport from 'passport';
import {
  loginUser,
  currentUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  showResetForm,
  resetPassword
} from '../../controllers/session.controller.js';

const router = Router();

// Login: manejo manual para mostrar mensaje si falla
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // Usa el mensaje definido en tu local.strategy.js
      const msg = info && info.message ? info.message : 'Credenciales inválidas';
      return res.redirect(`/login?error=${encodeURIComponent(msg)}`);
    }
    req.user = user; // para que loginUser pueda acceder a req.user
    return loginUser(req, res, next);
  })(req, res, next);
});

// Register
router.post('/register', registerUser);

// Current → devuelve usuario autenticado (desde cookie)
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  currentUser
);

// Logout → borra cookie
router.get('/logout', logoutUser);

// Recuperar contraseña
router.post('/forgot', requestPasswordReset);
router.get('/reset-password/:token', showResetForm);
router.post('/reset-password/:token', resetPassword);

export default router;
