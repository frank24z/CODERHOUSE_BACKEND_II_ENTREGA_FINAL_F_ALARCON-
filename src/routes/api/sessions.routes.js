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


router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {

      const msg = info && info.message ? info.message : 'Credenciales inválidas';
      return res.redirect(`/login?error=${encodeURIComponent(msg)}`);
    }
    req.user = user;
    return loginUser(req, res, next);
  })(req, res, next);
});


router.post('/register', registerUser);


router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  currentUser
);


router.get('/logout', logoutUser);


router.post('/forgot', requestPasswordReset);
router.get('/reset-password/:token', showResetForm);
router.post('/reset-password/:token', resetPassword);

export default router;
