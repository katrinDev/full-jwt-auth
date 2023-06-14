const nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendActivationMail(mail, link) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mail,
      subject: "Account activation for " + process.env.API_URL,
      text: "",
      html: `
        <div>
            <h1>Click the link to activate your account</h1>
            <a href="${link}">Verification Link</a>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
