import Mail from "nodemailer/lib/mailer";
import dotenv from "dotenv";
import transporter from "./sendmail.service";
export default class EmailService {
  constructor() {
    dotenv.config();
  }

  public async sendMail(alert: string, email: string[], factura: string) {
    try {
      const mailOptions: Mail.Options = {
        from: process.env.EMAIL,
        to: email.join(','),
        subject: "RESPUESTA DE FORO ",
        text: alert,
        html: `<h3>NUEVO POST GENERADO:::: ${factura}</h3>`,
      };
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          throw error;
        } else {
          return info.response;
        }
      });
    } catch (error) {
      return null;
    }
  }
}
