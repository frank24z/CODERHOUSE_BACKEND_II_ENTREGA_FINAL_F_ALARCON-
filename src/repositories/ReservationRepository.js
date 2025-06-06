const Reservation = require('../dao/models/Reservation');

class ReservationRepository {
  async create(data) {
    return await Reservation.create(data);
  }

  async findByUser(userId) {
    return await Reservation.find({ user: userId })
      .populate('room')
      .lean();
  }

  async cancelReservation(reservationId, userId) {
    const reservation = await Reservation.findOne({ _id: reservationId, user: userId });
    if (!reservation) return null;

    reservation.status = 'cancelled';
    return await reservation.save();
  }

  async findById(id) {
    return await Reservation.findById(id).populate('room').lean();
  }
}

module.exports = new ReservationRepository();
