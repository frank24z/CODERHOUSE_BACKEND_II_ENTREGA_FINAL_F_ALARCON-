import bcrypt from 'bcrypt';

// Encripta una contraseña
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Compara contraseña con el hash guardado
export const isValidPassword = (user, inputPassword) => {
  return bcrypt.compareSync(inputPassword, user.password);
};
