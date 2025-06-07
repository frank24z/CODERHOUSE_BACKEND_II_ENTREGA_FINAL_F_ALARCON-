import express from 'express';
import { getRooms } from '../../controllers/room.controller.js';

const router = express.Router();

// Ruta raíz para la página de inicio
router.get('/', (req, res) => {
  res.render('home');
});

// GET login con soporte para mensajes
router.get('/login', (req, res) => {
  res.render('login', {
    error: req.query.error,
    success: req.query.success
  });
});

// GET register con soporte para mensajes
router.get('/register', (req, res) => {
  res.render('register', {
    error: req.query.error,
    success: req.query.success
  });
});

// GET recuperar contraseña
router.get('/forgot-password', (req, res) => {
  res.render('requestReset', {
    error: req.query.error,
    success: req.query.success
  });
});

// GET reset password (desde el link del correo)
router.get('/reset-password/:token', (req, res) => {
  res.render('resetPassword', {
    token: req.params.token,
    error: req.query.error,
    success: req.query.success
  });
});

// Rutas protegidas (redirige si no hay user)
router.get('/profile', (req, res) => {
  if (!req.user) return res.redirect('/login?error=Debes iniciar sesión');
  res.render('profile', { user: req.user });
});

router.get('/my-reservations', (req, res) => {
  if (!req.user) return res.redirect('/login?error=Debes iniciar sesión');
  res.render('reservations', { user: req.user });
});

// Nueva ruta protegida para habitaciones
router.get('/rooms', (req, res) => {
  if (!req.user) return res.redirect('/login?error=Debes iniciar sesión');
  getRooms(req, res);
});

export default router;
