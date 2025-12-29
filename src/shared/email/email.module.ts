import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Global() // Makes MailService available everywhere without re-importing
@Module({
    providers: [MailService],
    exports: [MailService],
})
export class EmailModule { }