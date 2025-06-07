import passport from 'passport';
import { getLocalStrategy } from './local.strategy.js';
import { getJWTStrategy } from './jwt.strategy.js';

// Función para inicializar Passport con las estrategias que uses
export const initPassport = () => {
  // Inicializa la estrategia local para login con usuario y contraseña
  getLocalStrategy(passport);

  // Inicializa la estrategia JWT para proteger rutas y validar token
  getJWTStrategy(passport);
};
