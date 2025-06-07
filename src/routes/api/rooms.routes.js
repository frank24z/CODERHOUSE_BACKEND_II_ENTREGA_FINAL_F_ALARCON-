const express = require('express');
const { getRooms, createRoom } = require('../../controllers/room.controller');
const { authenticateJWT, authorizeRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticateJWT, getRooms);
router.post('/', authenticateJWT, authorizeRole(['admin1', 'admin2']), createRoom);

export default router;
