const Reservation = require('../dao/models/Reservation');

const createReservation = async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  await Reservation.create({
    user: req.user._id,
    room: roomId,
    checkInDate,
    checkOutDate
  });

  res.redirect('/my-reservations');
};

const cancelReservation = async (req, res) => {
  const { id } = req.params;

  const reservation = await Reservation.findOne({ _id: id, user: req.user._id });

  if (!reservation) {
    return res.status(404).send('Reserva no encontrada');
  }

  reservation.status = 'cancelled';
  await reservation.save();

  res.redirect('/my-reservations');
};

const getMyReservations = async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id })
    .populate('room')
    .lean();

  res.render('reservations', { reservations });
};

module.exports = {
  createReservation,
  cancelReservation,
  getMyReservations
};
