import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../../dao/models/User.js';

export const getJWTStrategy = (passport) => {
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),           // Soporte opcional
      req => req?.cookies?.jwtCookie                      // Leer desde cookie
    ]),
    secretOrKey: process.env.JWT_SECRET
  }, async (payload, done) => {
    try {
      const user = await User.findById(payload.user._id).lean();
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
};
