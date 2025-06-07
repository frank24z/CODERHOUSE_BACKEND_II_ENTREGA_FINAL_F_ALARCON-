import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../../dao/models/User.js';

export const getJWTStrategy = (passport) => {
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      (req) => req?.cookies?.jwtCookie  
    ]),
    secretOrKey: process.env.JWT_SECRET
  }, async (payload, done) => {
    try {
    
      const userId = payload.user?._id || payload._id;

      const user = await User.findById(userId).lean();

      if (!user) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
};
