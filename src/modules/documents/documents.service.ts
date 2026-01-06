import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Document, DocumentDocument } from './models/document.model';
import { DocumentStatus, DocumentStatusDocument } from './models/document-status.model';
import { DocumentType, DocumentTypeDocument } from './models/document-type.model';
import { CreateDocumentInput } from './dto/create-document.input';
import { DocumentFilterInput } from './dto/document-filter.input';
import { CreateDocumentStatusInput } from './dto/create-document-status.input';
import { CreateDocumentTypeInput } from './dto/create-document-type.input';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectModel(Document.name) private documentModel: Model<DocumentDocument>,
        @InjectModel(DocumentStatus.name) private statusModel: Model<DocumentStatusDocument>,
        @InjectModel(DocumentType.name) private typeModel: Model<DocumentTypeDocument>,
    ) { }

    // --- System Constants Management (Admin) ---

    async createStatus(input: CreateDocumentStatusInput): Promise<DocumentStatusDocument> {
        return new this.statusModel(input).save();
    }

    async findAllStatuses(): Promise<DocumentStatusDocument[]> {
        return this.statusModel.find({ active: true }).exec();
    }

    async findStatusById(id: string): Promise<DocumentStatusDocument | null> {
        return this.statusModel.findById(id).exec();
    }

    async createType(input: CreateDocumentTypeInput): Promise<DocumentTypeDocument> {
        return new this.typeModel(input).save();
    }

    async findAllTypes(): Promise<DocumentTypeDocument[]> {
        return this.typeModel.find({ active: true }).exec();
    }

    async findTypeById(id: string): Promise<DocumentTypeDocument | null> {
        return this.typeModel.findById(id).exec();
    }

    // --- Main Document Logic ---

    async create(input: CreateDocumentInput, ownerId: string): Promise<DocumentDocument> {
        // Resolve Type from Slug
        const type = await this.typeModel.findOne({ slug: input.type_slug, active: true });
        if (!type) throw new NotFoundException(`Type '${input.type_slug}' not found`);

        // Resolve Status from Slug (Default: draft)
        const statusSlug = input.status_slug || 'draft';
        const status = await this.statusModel.findOne({ slug: statusSlug, active: true });
        if (!status) throw new NotFoundException(`Status '${statusSlug}' not found`);

        const newDoc = new this.documentModel({
            ...input,
            type_id: type._id,
            status_id: status._id,
            owner_id: new Types.ObjectId(ownerId),
            project_id: new Types.ObjectId(input.project_id),
        });

        return newDoc.save();
    }

    async findAll(filter: DocumentFilterInput, ownerId: string): Promise<DocumentDocument[]> {
        const query: any = { owner_id: new Types.ObjectId(ownerId) };

        if (filter.project_id) query.project_id = new Types.ObjectId(filter.project_id);

        return this.documentModel.find(query).sort({ created_on: -1 }).exec();
    }

    async findOne(id: string, ownerId: string): Promise<DocumentDocument> {
        const doc = await this.documentModel.findById(id);
        if (!doc) throw new NotFoundException('Document not found');
        if (doc.owner_id.toString() !== ownerId) throw new ForbiddenException('You do not own this document');
        return doc;
    }
}