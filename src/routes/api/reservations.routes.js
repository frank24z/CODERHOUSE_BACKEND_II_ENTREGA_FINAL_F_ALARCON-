import { Router } from 'express';
import {
  createReservation,
  cancelReservation,
  getMyReservations
} from '../../controllers/reservation.controller.js';

import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware.js';

const router = Router();

// Crear reserva
router.post('/', authenticateJWT, authorizeRole(['user']), createReservation);

// Obtener reservas del usuario (puedes usar simplemente '/' para esto)
router.get('/', authenticateJWT, getMyReservations);

// Cancelar reserva
router.post('/:id/cancel', authenticateJWT, authorizeRole(['user']), cancelReservation);

export default router;
