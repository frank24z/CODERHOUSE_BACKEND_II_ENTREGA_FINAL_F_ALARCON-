const passport = require('passport');
const { getLocalStrategy } = require('./local.strategy');
const { getJWTStrategy } = require('./jwt.strategy');

const initPassport = () => {
  getLocalStrategy(passport);
  getJWTStrategy(passport);
};

module.exports = { initPassport };
