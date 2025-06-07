import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../dao/models/User.js';
import { isValidPassword } from '../../utils/encryption.js';

export const getLocalStrategy = (passport) => {
  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      if (!isValidPassword(user, password)) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};
