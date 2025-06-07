import User from '../dao/models/User.js';

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }
  async create(userData) {
    return User.create(userData);
  }
  // Agrega más métodos según tu lógica
}

export default new UserRepository();
