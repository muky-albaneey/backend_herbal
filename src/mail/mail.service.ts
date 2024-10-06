import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(){

        this.transporter = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
              user: "smtp@mailtrap.io",
              pass: "1599b03592cc08a1bd2e24a53f3c9ea2"
            }
          });

    }

    async dispatchEmail(to: string, subject: string, text: string, html?:string): Promise<void>{
        const mail = {
            from : "nava@navatechx.com.ng",
            to,
            subject,
            text
        }

        try {
            await this.transporter.sendMail(mail);
            console.log('email is working');
            
        } catch (error) {
            console.log(error, 'in sending emails');
        }
    }
}
