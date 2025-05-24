const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "kunalpawar8319@gmail.com",
      pass: process.env.PASSWORD_EMAIL,
    },
  });

  const mailOptions = {
    from: "kunalpawar8319@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email: %s", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
