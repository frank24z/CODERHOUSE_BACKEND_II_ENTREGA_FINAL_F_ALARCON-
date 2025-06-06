const User = require('../dao/models/User');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id).lean();
  }

  async updatePassword(id, newHashedPassword) {
    return await User.findByIdAndUpdate(id, { password: newHashedPassword });
  }

  async getAll() {
    return await User.find().lean();
  }
}

module.exports = new UserRepository();
