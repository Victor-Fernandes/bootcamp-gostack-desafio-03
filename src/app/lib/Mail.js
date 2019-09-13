import noidemailer from 'nodemailer';
import mailConfig from '../../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = noidemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(message) {
    return this.sendMail({
      ...mailConfig,
      ...message,
    });
  }
}

export default new Mail();
