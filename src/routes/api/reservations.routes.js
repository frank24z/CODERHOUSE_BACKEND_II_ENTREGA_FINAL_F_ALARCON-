import { Router } from 'express';
import {
  createReservation,
  cancelReservation,
  getMyReservations
} from '../../controllers/reservation.controller.js';
import { authenticateJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticateJWT, createReservation);
router.get('/mine', authenticateJWT, getMyReservations);
router.post('/:id/cancel', authenticateJWT, cancelReservation);

export default router;
