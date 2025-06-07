import { Router } from 'express';
import { getRooms, createRoom } from '../../controllers/room.controller.js';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticateJWT, getRooms);
router.post('/', authenticateJWT, authorizeRole(['admin1', 'admin2']), createRoom);

export default router;
