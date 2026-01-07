import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ContactsService } from './contacts.service';
import { ContactEntity } from './entities/contacts.entity';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { ContactFilterInput } from './dto/contact-filter.input';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';

@Resolver(() => ContactEntity)
export class ContactsResolver {
    constructor(private readonly contactsService: ContactsService) { }

    @Public()
    @Mutation(() => ContactEntity, { description: 'Public endpoint to submit a contact inquiry' })
    async createContact(@Args('createContactInput') createContactInput: CreateContactInput) {
        return this.contactsService.create(createContactInput);
    }

    @Roles('ADMIN')
    @Query(() => [ContactEntity], { name: 'contacts', description: 'Retrieve all contact submissions (Admin only)' })
    async findAll(@Args('filter', { nullable: true }) filter: ContactFilterInput) {
        return this.contactsService.findAll(filter);
    }

    @Roles('ADMIN')
    @Query(() => ContactEntity, { name: 'contact', description: 'Retrieve a specific contact entry by ID (Admin only)' })
    async findOne(@Args('id', { type: () => ID }) id: string) {
        return this.contactsService.findOne(id);
    }

    @Roles('ADMIN')
    @Mutation(() => ContactEntity, { description: 'Update a contact entry status or details (Admin only)' })
    async updateContact(@Args('updateContactInput') updateContactInput: UpdateContactInput) {
        return this.contactsService.update(updateContactInput.id, updateContactInput);
    }

    @Roles('ADMIN')
    @Mutation(() => Boolean, { description: 'Delete a contact submission (Admin only)' })
    async removeContact(@Args('id', { type: () => ID }) id: string) {
        return this.contactsService.remove(id);
    }
}