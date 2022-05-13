import { Global, Module } from '@nestjs/common';
import { MailService } from '../service/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: () => ({
                transport: {
                    host: 'outlook.office365.com',
                    port: 587,
                    secure: false, // upgrade later with STARTTLS
                    auth: {
                        // user: config.get<string>('outlook_user'),
                        // pass: config.get<string>('outlook_pass'),
                        user: process.env.OUTLOOK_USER,
                        pass: process.env.OUTLOOK_PASS,
                    },
                },
                defaults: {
                    from: '"nest-modules" <modules@nestjs.com>',
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
