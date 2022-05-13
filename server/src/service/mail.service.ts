import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public async sendConfirmationEmail(token: string, toEmail: string): Promise<any> {
        await this.mailerService
            .sendMail({
                to: toEmail, // list of receivers
                from: 'duong.td183726@sis.hust.edu.vn', // sender address
                subject: 'Confirm your Registration ✔', // Subject line
                text: `Thank you for register to my App, " +
                "please click on the below url to activate your account : " +
                "http://localhost:8081/api/activate/${token}`, // plaintext body
                html: `<b>Thank you for register to my App, " +
                "please click on the below url to activate your account : " +
                "http://localhost:8081/api/activate/${token}`, // HTML body content
            })
            .then(success => {
                // console.log(success);
            })
            .catch(err => {
                // console.log(err);
            });
    }
}
