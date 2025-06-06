const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendPasswordResetMail = async (email, link) => {
  await transporter.sendMail({
    from: 'Hotel App <no-reply@hotel.com>',
    to: email,
    subject: 'Restablecer contraseña',
    html: `<p>Hacé clic para restablecer tu contraseña:</p>
           <a href="${link}">${link}</a>
           <p>Este enlace expira en 1 hora.</p>`
  });
};

module.exports = { sendPasswordResetMail };
