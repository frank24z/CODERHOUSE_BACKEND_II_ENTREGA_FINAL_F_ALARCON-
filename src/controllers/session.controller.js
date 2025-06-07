import jwt from 'jsonwebtoken';
import User from '../dao/models/User.js';
import { createHash, isValidPassword } from '../utils/encryption.js';
import { sendPasswordResetMail } from '../services/mailing.service.js';

// 🔐 Login (passport local ya autenticó)
export const loginUser = async (req, res) => {
  const user = req.user;
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res
    .cookie('jwtCookie', token, {
      httpOnly: true,
      maxAge: 3600000
    })
    .redirect('/profile');
};

// 🔐 Estrategia current
export const currentUser = async (req, res) => {
  const { user } = req;
  const dto = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    role: user.role
  };
  res.json({ status: 'success', payload: dto });
};

// 🔒 Logout
export const logoutUser = (req, res) => {
  res.clearCookie('jwtCookie').redirect('/');
};

// 🆕 Registro local (ruta directa)
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).render('register', { error: 'El usuario ya existe' });

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
    console.error('❌ Error en el registro:', err);
    res.status(500).render('register', { error: 'Error interno' });
  }
};

// 🛠️ Solicitar recuperación de contraseña
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.render('requestReset', { error: 'Usuario no encontrado' });

  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const link = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

    await sendPasswordResetMail(email, link);
    return res.render('requestReset', { success: 'Correo enviado. Revisa tu bandeja de entrada.' });
  } catch (error) {
    console.error('Error enviando mail:', error);
    return res.render('requestReset', { error: 'Error enviando el correo. Intenta más tarde.' });
  }
};


// 📝 Mostrar formulario de nueva contraseña
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
    if (same) return res.render('resetPassword', { token, error: 'No podés usar la misma contraseña' });

    const newHash = createHash(password);
    await User.findByIdAndUpdate(user._id, { password: newHash });

    // Renderizamos la vista con mensaje de éxito
    res.render('resetPassword', { success: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    res.render('resetPassword', { token, error: 'Token inválido o expirado' });
  }
};




