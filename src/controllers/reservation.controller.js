import Reservation from '../dao/models/Reservation.js';

export const createReservation = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    // Validaciones básicas
    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).send('Faltan datos requeridos para la reserva');
    }

    await Reservation.create({
      user: req.user._id,
      room: roomId,
      checkInDate,
      checkOutDate
    });

    res.redirect('/my-reservations');
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).send('Error al crear la reserva');
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findOne({ _id: id, user: req.user._id });

    if (!reservation) {
      return res.status(404).send('Reserva no encontrada');
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.redirect('/my-reservations');
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    res.status(500).send('Error al cancelar la reserva');
  }
};

export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('room')
      .lean();

    res.render('reservations', { reservations, user: req.user });
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    res.status(500).send('Error al obtener reservas');
  }
};
