import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/profile', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('profile', { user: req.user });
});

router.get('/my-reservations', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('reservations', { user: req.user });
});

export default router;
