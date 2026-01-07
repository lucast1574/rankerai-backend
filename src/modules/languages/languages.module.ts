import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguagesService } from './languages.service';
import { LanguagesResolver } from './languages.resolver';
import { Language, LanguageSchema } from './models/language.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Language.name, schema: LanguageSchema }]),
    ],
    providers: [LanguagesResolver, LanguagesService],
    exports: [LanguagesService],
})
export class LanguagesModule { }