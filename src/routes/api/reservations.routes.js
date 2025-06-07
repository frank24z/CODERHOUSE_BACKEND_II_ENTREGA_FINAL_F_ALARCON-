const express = require('express');
const {
  createReservation,
  cancelReservation,
  getMyReservations
} = require('../../controllers/reservation.controller');

const { authenticateJWT } = require('../../middlewares/auth.middleware');
const router = express.Router();

router.post('/', authenticateJWT, createReservation);
router.get('/mine', authenticateJWT, getMyReservations);
router.post('/:id/cancel', authenticateJWT, cancelReservation);

export default router;

