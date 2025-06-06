const bcrypt = require('bcrypt');

// Encripta una contraseña
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Compara contraseña con el hash guardado
const isValidPassword = (user, inputPassword) => {
  return bcrypt.compareSync(inputPassword, user.password);
};

module.exports = {
  createHash,
  isValidPassword
};
