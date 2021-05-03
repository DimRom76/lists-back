const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
require('dotenv').config();
// https://dimrom-lists-front.netlify.app/

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;

  #createTemplate(verifyToken, host, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'default',
      product: {
        name: 'Lists',
        link: host,
      },
    });

    const email = {
      body: {
        name: `Dear ${name}`,
        intro: "Welcome to Lists! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Lists, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            //link: `${host}api/users/verify/${verifyToken}`,
            link: `${host}users/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }

  async sendEmail(verifyToken, email, name) {
    const host = process.env.LINK_FROM_EMAIL;
    const emailBody = this.#createTemplate(verifyToken, host, name);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email, // Change to your recipient
      from: 'dimaweb@rambler.ru', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      html: emailBody,
    };

    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
