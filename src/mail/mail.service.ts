import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(){

        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "c848dd42d3c9f4",
              pass: "fe45f8091abbc5"
            }
          });

    }

    async dispatchEmail(to: string, subject: string, text: string, html?:string): Promise<void>{
        const mail = {
            from : "mukyalbani1@ggmail.com",
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
