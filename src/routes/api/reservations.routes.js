import { Router } from 'express';
import {
  createReservation,
  cancelReservation,
  getMyReservations
} from '../../controllers/reservation.controller.js';

import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware.js';

const router = Router();

// Solo usuarios autenticados con rol 'user' pueden crear reservas
router.post('/', authenticateJWT, authorizeRole(['user']), createReservation);

// Obtener mis reservas (usuarios autenticados)
router.get('/mine', authenticateJWT, getMyReservations);

// Cancelar reserva (usuarios autenticados)
router.post('/:id/cancel', authenticateJWT, authorizeRole(['user']), cancelReservation);

export default router;
