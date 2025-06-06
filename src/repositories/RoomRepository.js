const Room = require('../dao/models/Room');

class RoomRepository {
  async getAll() {
    return await Room.find().lean();
  }

  async create(roomData) {
    return await Room.create(roomData);
  }

  async findById(id) {
    return await Room.findById(id).lean();
  }

  async update(id, updateData) {
    return await Room.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  async delete(id) {
    return await Room.findByIdAndDelete(id);
  }
}

module.exports = new RoomRepository();
