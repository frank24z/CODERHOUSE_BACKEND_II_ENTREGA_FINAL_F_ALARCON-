import { Router } from 'express';
import {
  createReservation,
  cancelReservation,
  getMyReservations
} from '../../controllers/reservation.controller.js';

import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware.js';

const router = Router();


router.post('/', authenticateJWT, authorizeRole(['user']), createReservation);


router.get('/', authenticateJWT, getMyReservations);


router.post('/:id/cancel', authenticateJWT, authorizeRole(['user']), cancelReservation);

export default router;
