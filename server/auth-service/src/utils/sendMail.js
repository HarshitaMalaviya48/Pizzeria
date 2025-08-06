const nodemailer = require("nodemailer");

const sendMail = async (to, subject, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "adrain.lubowitz47@ethereal.email",
      pass: "GgW2xB9eA4KzWY2kRw",
    },
  });

  return await transporter.sendMail({
    from: '"Pizzeria" <adrain.lubowitz47@ethereal.email>',
    to,
    subject,
    html: `Click to reset your Password : <a href="${link}" target="_blank">${link}</a>`
  })
};

module.exports = { sendMail };
