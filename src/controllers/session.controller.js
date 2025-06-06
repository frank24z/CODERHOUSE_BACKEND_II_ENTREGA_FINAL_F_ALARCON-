const jwt = require('jsonwebtoken');
const User = require('../dao/models/User');
const { createHash, isValidPassword } = require('../utils/encryption');
const { sendPasswordResetMail } = require('../services/mailing.service');

const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Login (passport local ya autenticó)
const loginUser = async (req, res) => {
  const user = req.user;

  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h' });

  res
    .cookie('jwtCookie', token, {
      httpOnly: true,
      maxAge: 3600000
    })
    .redirect('/profile');
};

// 🔐 Estrategia current
const currentUser = async (req, res) => {
  const { user } = req;
  const dto = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    role: user.role
  };

  res.json({ status: 'success', payload: dto });
};

// 🔒 Logout
const logoutUser = (req, res) => {
  res.clearCookie('jwtCookie').redirect('/');
};

// 🆕 Registro local (ruta directa)
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).send('El usuario ya existe');

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    };

    await User.create(newUser);
    res.redirect('/login');
  } catch (err) {
    console.error('❌ Error en el registro:', err);
    res.status(500).send('Error interno');
  }
};

// 🛠️ Solicitar recuperación de contraseña
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send('Usuario no encontrado');

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  const link = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

  await sendPasswordResetMail(email, link);
  res.send('Enlace enviado al correo.');
};

// 📝 Mostrar formulario de nueva contraseña
const showResetForm = (req, res) => {
  const { token } = req.params;
  res.render('resetPassword', { token });
};

// 🔁 Cambiar contraseña
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Token inválido');

    const same = isValidPassword(user, password);
    if (same) return res.status(400).send('No podés usar la misma contraseña');

    const newHash = createHash(password);
    await User.findByIdAndUpdate(user._id, { password: newHash });

    res.send('Contraseña actualizada');
  } catch (err) {
    res.status(400).send('Token inválido o expirado');
  }
};

module.exports = {
  loginUser,
  logoutUser,
  currentUser,
  registerUser,
  requestPasswordReset,
  showResetForm,
  resetPassword
};
