import Room from '../dao/models/Room.js';

export const getRooms = async (req, res, returnData = false) => {
  try {
    const rooms = await Room.find().lean();

    if (returnData) {
      return rooms; 
    }


    res.render('rooms', { rooms, user: req.user });
  } catch (error) {
    console.error('Error al obtener habitaciones:', error);
    if (returnData) return [];
    res.status(500).send('Error interno del servidor');
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, description, price, capacity } = req.body;
    await Room.create({
      name,
      description,
      price,
      capacity,
      createdBy: req.user._id
    });
    res.redirect('/rooms');
  } catch (error) {
    console.error('Error al crear habitación:', error);
    res.status(500).send('Error interno del servidor');
  }
};
