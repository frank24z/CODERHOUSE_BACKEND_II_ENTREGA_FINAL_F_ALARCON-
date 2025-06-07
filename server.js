import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import { engine } from 'express-handlebars';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { initPassport } from './src/config/passport/passport.config.js';

import sessionRoutes from './src/routes/api/sessions.routes.js';
import roomRoutes from './src/routes/api/rooms.routes.js';
import reservationRoutes from './src/routes/api/reservations.routes.js';
import publicRoutes from './src/routes/views/public.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


initPassport();
app.use(passport.initialize());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));


app.use((req, res, next) => {
  const token = req.cookies.jwtCookie;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      res.locals.user = req.user;
    } catch {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});


app.engine('handlebars', engine({
  helpers: {
    eq: (a, b) => a === b,
    formatDate: (date) => moment(date).format('DD/MM/YYYY')
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'src', 'views'));


app.use('/api/sessions', sessionRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/', publicRoutes);


//console.log('DEBUG MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor andando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error MongoDB:', err);
  });
