import Room from '../dao/models/Room.js';

export const getRooms = async (req, res) => {
  const rooms = await Room.find().lean();
  res.render('rooms', { rooms, user: req.user });
};

export const createRoom = async (req, res) => {
  const { name, description, price, capacity } = req.body;
  const room = await Room.create({
    name,
    description,
    price,
    capacity,
    createdBy: req.user._id
  });
  res.redirect('/rooms');
};
