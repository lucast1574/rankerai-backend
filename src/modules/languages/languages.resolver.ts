import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LanguagesService } from './languages.service';
import { LanguageEntity } from './entities/language.entity';
import { CreateLanguageInput } from './dto/create-language.input';
import { UpdateLanguageInput } from './dto/update-language.input';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';

@Resolver(() => LanguageEntity)
export class LanguagesResolver {
    constructor(private readonly languagesService: LanguagesService) { }

    @Public() // Publicly accessible for frontend configuration
    @Query(() => [LanguageEntity], { name: 'languages', description: 'Get all supported languages' })
    async findAll(@Args('onlyActive', { type: () => Boolean, defaultValue: false }) onlyActive: boolean) {
        return this.languagesService.findAll(onlyActive);
    }

    @Roles('ADMIN')
    @Mutation(() => LanguageEntity, { description: 'Create a new language (Admin only)' })
    async createLanguage(@Args('createLanguageInput') createLanguageInput: CreateLanguageInput) {
        return this.languagesService.create(createLanguageInput);
    }

    @Roles('ADMIN')
    @Query(() => LanguageEntity, { name: 'language', description: 'Get a specific language by ID' })
    async findOne(@Args('id', { type: () => ID }) id: string) {
        return this.languagesService.findOne(id);
    }

    @Roles('ADMIN')
    @Mutation(() => LanguageEntity, { description: 'Update language details (Admin only)' })
    async updateLanguage(@Args('updateLanguageInput') updateLanguageInput: UpdateLanguageInput) {
        return this.languagesService.update(updateLanguageInput.id, updateLanguageInput);
    }

    @Roles('ADMIN')
    @Mutation(() => Boolean, { description: 'Remove a language (Admin only)' })
    async removeLanguage(@Args('id', { type: () => ID }) id: string) {
        return this.languagesService.remove(id);
    }
}