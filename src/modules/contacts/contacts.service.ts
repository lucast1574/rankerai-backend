import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Sentry from '@sentry/nestjs';
import { Contact, ContactDocument } from './models/contacts.model';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { ContactFilterInput } from './dto/contact-filter.input';

@Injectable()
export class ContactsService {
    constructor(
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    ) { }

    async create(createContactInput: CreateContactInput): Promise<ContactDocument> {
        try {
            const newContact = new this.contactModel(createContactInput);
            return await newContact.save();
        } catch (error) {
            Sentry.captureException(error);
            throw new InternalServerErrorException('An error occurred while saving the contact request');
        }
    }

    async findAll(filter?: ContactFilterInput): Promise<ContactDocument[]> {
        const query: any = {};

        if (filter?.searchTerm) {
            query.$or = [
                { name: { $regex: filter.searchTerm, $options: 'i' } },
                { email: { $regex: filter.searchTerm, $options: 'i' } },
                { reason: { $regex: filter.searchTerm, $options: 'i' } },
                { message: { $regex: filter.searchTerm, $options: 'i' } },
            ];
        } else if (filter) {
            if (filter.name) query.name = { $regex: filter.name, $options: 'i' };
            if (filter.email) query.email = filter.email;
            if (filter.reason) query.reason = filter.reason;
        }

        return await this.contactModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<ContactDocument> {
        const contact = await this.contactModel.findById(id).exec();
        if (!contact) {
            throw new NotFoundException(`Contact entry with ID ${id} not found`);
        }
        return contact;
    }

    async update(id: string, updateContactInput: UpdateContactInput): Promise<ContactDocument> {
        try {
            const existingContact = await this.contactModel
                .findByIdAndUpdate(id, updateContactInput, { new: true })
                .exec();

            if (!existingContact) {
                throw new NotFoundException(`Contact entry with ID ${id} not found`);
            }
            return existingContact;
        } catch (error) {
            Sentry.captureException(error);
            throw new InternalServerErrorException('Failed to update contact entry');
        }
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.contactModel.findByIdAndDelete(id).exec();
        return !!result;
    }
}