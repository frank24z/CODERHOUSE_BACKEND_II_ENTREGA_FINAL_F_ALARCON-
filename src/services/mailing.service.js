import nodemailer from 'nodemailer';

export const sendPasswordResetMail = async (email, link) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: 'Hotel App <no-reply@hotel.com>',
    to: email,
    subject: 'Restablecer contraseña',
    html: `<p>Clic para restablecer tu contraseña:</p>
           <a href="${link}">${link}</a>
           <p>Link expira en una hora.</p>`
  });
};
