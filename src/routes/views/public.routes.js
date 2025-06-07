import express from 'express';
import { getRooms } from '../../controllers/room.controller.js';
import Reservation from '../../dao/models/Reservation.js';

const router = express.Router();


router.get('/', (req, res) => {
  res.render('home');
});


router.get('/login', (req, res) => {
  res.render('login', {
    error: req.query.error,
    success: req.query.success
  });
});

router.get('/register', (req, res) => {
  res.render('register', {
    error: req.query.error,
    success: req.query.success
  });
});

router.get('/forgot-password', (req, res) => {
  res.render('requestReset', {
    error: req.query.error,
    success: req.query.success
  });
});

router.get('/reset-password/:token', (req, res) => {
  res.render('resetPassword', {
    token: req.params.token,
    error: req.query.error,
    success: req.query.success
  });
});

router.get('/profile', (req, res) => {
  if (!req.user) return res.redirect('/login?error=Debes iniciar sesión');
  res.render('profile', { user: req.user });
});

router.get('/rooms', async (req, res) => {
  if (!req.user) return res.redirect('/login?error=Debes iniciar sesión');

  try {

    const rooms = await getRooms(req, res, true);
    res.render('rooms', { rooms, user: req.user });
  } catch (err) {
    console.error('Error al cargar las habitaciones:', err);
    res.status(500).send('Error al cargar las habitaciones');
  }
});


router.get('/my-reservations', async (req, res) => {
  if (!req.user) return res.redirect('/login?error=Debes iniciar sesión');

  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('room')
      .lean();

    res.render('reservations', { reservations, user: req.user });
  } catch (err) {
    console.error('Error obteniendo reservas:', err);
    res.status(500).send('Error al obtener reservas');
  }
});

export default router;
