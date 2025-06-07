import Reservation from '../dao/models/Reservation.js';

export const createReservation = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).send('Faltan datos requeridos para la reserva');
    }

    // Crear la reserva con estado explícito 'active'
    await Reservation.create({
      user: req.user._id,
      room: roomId,
      checkInDate,
      checkOutDate,
      status: 'active'
    });

    // Redirigir a la vista donde se muestran las reservas del usuario
    res.redirect('/my-reservations');
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).send('Error al crear la reserva');
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la reserva que coincida con el id y el usuario autenticado
    const reservation = await Reservation.findOne({ _id: id, user: req.user._id });

    if (!reservation) {
      return res.status(404).send('Reserva no encontrada');
    }

    // Cambiar estado a 'cancelled' y guardar
    reservation.status = 'cancelled';
    await reservation.save();

    // Redirigir a la lista de reservas del usuario
    res.redirect('/my-reservations');
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    res.status(500).send('Error al cancelar la reserva');
  }
};

export const getMyReservations = async (req, res) => {
  try {
    // Buscar todas las reservas del usuario, poblando la habitación relacionada para mostrar detalles
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('room')
      .lean();

    // Renderizar la vista 'reservations' con las reservas y datos del usuario
    res.render('reservations', { reservations, user: req.user });
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    res.status(500).send('Error al obtener reservas');
  }
};
