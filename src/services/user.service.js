const UserRepository = require('../repositories/UserRepository');
const { createHash, isValidPassword } = require('../utils/encryption');

class UserService {
  async register(userData) {
    const existing = await UserRepository.findByEmail(userData.email);
    if (existing) throw new Error('El usuario ya existe');

    userData.password = createHash(userData.password);
    return await UserRepository.create(userData);
  }

  async validateCredentials(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) return null;

    const valid = isValidPassword(user, password);
    return valid ? user : null;
  }

  async resetPassword(email, newPassword) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');

    const same = isValidPassword(user, newPassword);
    if (same) throw new Error('No podés usar la misma contraseña');

    const hash = createHash(newPassword);
    await UserRepository.updatePassword(user._id, hash);

    return true;
  }
}

module.exports = new UserService();
