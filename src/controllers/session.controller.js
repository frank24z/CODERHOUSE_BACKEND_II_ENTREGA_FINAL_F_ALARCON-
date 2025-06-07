import jwt from 'jsonwebtoken';
import User from '../dao/models/User.js';
import { createHash, isValidPassword } from '../utils/encryption.js';
import { sendPasswordResetMail } from '../services/mailing.service.js';


export const loginUser = async (req, res) => {
  const user = req.user;

 
  const payload = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    role: user.role
  };


  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res
    .cookie('jwtCookie', token, {
      httpOnly: true,
      maxAge: 3600000 
    })
    .redirect('/profile');
};


export const currentUser = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'No autenticado' });
  }

  const dto = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role
  };

  res.json({ status: 'success', payload: dto });
};


export const logoutUser = (req, res) => {
  res.clearCookie('jwtCookie').redirect('/');
};


export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).render('register', { error: 'El usuario ya existe' });
    }

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    };

    await User.create(newUser);
    res.redirect('/login?success=Usuario registrado con éxito');
  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).render('register', { error: 'Error interno' });
  }
};


export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.render('requestReset', { error: 'Usuario no encontrado' });

  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const link = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

    await sendPasswordResetMail(email, link);
    return res.render('requestReset', { success: 'Correo enviado. Revisa tu correo y en spam.' });
  } catch (error) {
    console.error('Error enviando mail:', error);
    return res.render('requestReset', { error: 'Error enviando el correo. Intenta más tarde.' });
  }
};


export const showResetForm = (req, res) => {
  const { token } = req.params;
  res.render('resetPassword', { token });
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email });
    if (!user) return res.render('resetPassword', { token, error: 'Token inválido' });

    const same = isValidPassword(user, password);
    if (same) return res.render('resetPassword', { token, error: 'No puedes usar la misma contraseña' });

    const newHash = createHash(password);
    await User.findByIdAndUpdate(user._id, { password: newHash });

    res.render('resetPassword', { success: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    res.render('resetPassword', { token, error: 'Token inválido o expirado' });
  }
};
