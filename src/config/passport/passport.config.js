import passport from 'passport';
import { getLocalStrategy } from './local.strategy.js';
import { getJWTStrategy } from './jwt.strategy.js';

export const initPassport = () => {
  getLocalStrategy(passport);
  getJWTStrategy(passport);
};
