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

// Login → genera cookie con JWT
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  loginUser
);

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
