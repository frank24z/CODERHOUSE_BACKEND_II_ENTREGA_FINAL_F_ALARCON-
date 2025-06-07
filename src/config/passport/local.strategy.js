import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../dao/models/User.js';
import { isValidPassword } from '../../utils/encryption.js';

export const getLocalStrategy = (passport) => {
  passport.use('login', new LocalStrategy({
    usernameField: 'email',  // campo email para username
    passwordField: 'password',
    session: false
  }, async (email, password, done) => {
    try {
      // Buscar usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      // Validar contraseña con función segura
      const validPassword = await isValidPassword(user, password);
      if (!validPassword) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      // Si todo OK, devolver el usuario
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};
