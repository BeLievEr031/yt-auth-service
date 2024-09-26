import nodemailer, { TransportOptions } from 'nodemailer';
import { TransporterObj } from '../types';
class MailService {
  transporter;
  constructor(private transporterObj: TransporterObj) {
    this.transporter = nodemailer.createTransport({
      host: this.transporterObj.MAIL_HOST,
      port: this.transporterObj.MAIL_PORT,
      secure: false,
      auth: {
        user: this.transporterObj.MAIL_HOST_USER,
        pass: this.transporterObj.MAIL_HOST_PASS,
      },
    } as TransportOptions);
  }

  async sendForgetPasswordMail(receiversEmail: string) {
    try {
      const info = await this.transporter.sendMail({
        from: 'sandyrajak031@gmail.com',
        to: receiversEmail,
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>',
      });
      return info;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}

export default MailService;
