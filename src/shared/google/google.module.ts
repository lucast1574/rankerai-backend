import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';

@Module({
    providers: [GoogleService],
    exports: [GoogleService], // Export it so AuthModule can use it
})
export class GoogleModule { }