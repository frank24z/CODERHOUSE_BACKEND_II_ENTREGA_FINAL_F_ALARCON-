const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../../dao/models/User');
const { isValidPassword } = require('../../utils/encryption');

const getLocalStrategy = (passport) => {
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

module.exports = { getLocalStrategy };
