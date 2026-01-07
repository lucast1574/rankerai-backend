import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactsService } from './contacts.service';
import { ContactsResolver } from './contacts.resolver';
import { Contact, ContactSchema } from './models/contacts.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    ],
    providers: [ContactsResolver, ContactsService],
    exports: [ContactsService],
})
export class ContactsModule { }