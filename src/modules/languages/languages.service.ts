import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Sentry from '@sentry/nestjs';
import { Language, LanguageDocument } from './models/language.model';
import { CreateLanguageInput } from './dto/create-language.input';
import { UpdateLanguageInput } from './dto/update-language.input';

@Injectable()
export class LanguagesService {
    constructor(
        @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
    ) { }

    async create(createLanguageInput: CreateLanguageInput): Promise<LanguageDocument> {
        try {
            const newLanguage = new this.languageModel(createLanguageInput);
            return await newLanguage.save();
        } catch (error) {
            Sentry.captureException(error);
            throw new InternalServerErrorException('Failed to create language entry');
        }
    }

    async findAll(onlyActive: boolean = false): Promise<LanguageDocument[]> {
        const query = onlyActive ? { active: true } : {};
        return await this.languageModel.find(query).sort({ name: 1 }).exec();
    }

    async findOne(id: string): Promise<LanguageDocument> {
        const language = await this.languageModel.findById(id).exec();
        if (!language) {
            throw new NotFoundException(`Language with ID ${id} not found`);
        }
        return language;
    }

    async update(id: string, updateLanguageInput: UpdateLanguageInput): Promise<LanguageDocument> {
        try {
            const existingLanguage = await this.languageModel
                .findByIdAndUpdate(id, updateLanguageInput, { new: true })
                .exec();

            if (!existingLanguage) {
                throw new NotFoundException(`Language with ID ${id} not found`);
            }
            return existingLanguage;
        } catch (error) {
            Sentry.captureException(error);
            throw new InternalServerErrorException('Failed to update language entry');
        }
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.languageModel.findByIdAndDelete(id).exec();
        return !!result;
    }
}