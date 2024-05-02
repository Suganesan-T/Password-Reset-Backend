const nodemailer = require("nodemailer");
const {
  EMAIL_USERNAME,
  EMAIL_PWD,
} = require("../utils/config");

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PWD,
    },
  });

  //   defining email options
  const emailOPtions = {
    from: "S&T Companies support<support@scompnay.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(emailOPtions);
};

module.exports = sendEmail;