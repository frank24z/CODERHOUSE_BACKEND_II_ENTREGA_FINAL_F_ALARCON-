import { Router } from 'express';
import Room from '../../dao/models/Room.js';
import { authenticateJWT, authorizeRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const rooms = await Room.find().lean();

    res.render('rooms', { rooms, user: req.user });
  } catch (error) {
    res.status(500).send('Error al cargar habitaciones');
  }
});

router.post('/', authenticateJWT, authorizeRole(['admin1']), async (req, res) => {
  try {
    const { name, description, price, capacity } = req.body;

    await Room.create({
      name,
      description,
      price,
      capacity,
      createdBy: req.user._id
    });

    res.redirect('/api/rooms'); 
  } catch (error) {
    res.status(500).send('Error al crear habitación');
  }
});

export default router;
