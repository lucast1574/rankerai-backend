import { Resolver, Query, Mutation, Args, ResolveField, Parent, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentEntity } from './entities/document.entity';
import { DocumentStatusEntity } from './entities/document-status.entity';
import { DocumentTypeEntity } from './entities/document-type.entity';
import { CreateDocumentInput } from './dto/create-document.input';
import { DocumentFilterInput } from './dto/document-filter.input';
import { CreateDocumentStatusInput } from './dto/create-document-status.input';
import { CreateDocumentTypeInput } from './dto/create-document-type.input';
import { GqlAuthGuard } from '../../core/guards/auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ProjectOwnershipGuard } from '../../core/guards/project-ownership.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Document } from './models/document.model';

@Resolver(() => DocumentEntity)
@UseGuards(GqlAuthGuard, RolesGuard)
export class DocumentsResolver {
    constructor(private readonly documentsService: DocumentsService) { }

    @ResolveField('status', () => DocumentStatusEntity, { nullable: true })
    async getStatus(@Parent() document: Document) {
        const doc = document as any;
        if (!doc.status_id) return null;
        return this.documentsService.findStatusById(doc.status_id.toString());
    }

    @ResolveField('type', () => DocumentTypeEntity, { nullable: true })
    async getType(@Parent() document: Document) {
        const doc = document as any;
        if (!doc.type_id) return null;
        return this.documentsService.findTypeById(doc.type_id.toString());
    }

    @UseGuards(ProjectOwnershipGuard)
    @Mutation(() => DocumentEntity)
    @Roles('DOCUMENT_CREATE')
    async createDocument(
        @Args('input') input: CreateDocumentInput,
        @CurrentUser() user: any
    ) {
        return this.documentsService.create(input, user._id?.toString() || user.id);
    }

    @UseGuards(ProjectOwnershipGuard)
    @Query(() => [DocumentEntity], { name: 'getDocuments' })
    @Roles('DOCUMENT_VIEW')
    async getDocuments(
        @Args('filter', { nullable: true }) filter: DocumentFilterInput,
        @CurrentUser() user: any
    ) {
        return this.documentsService.findAll(filter || {}, user._id?.toString() || user.id);
    }

    @Query(() => DocumentEntity, { name: 'getDocument' })
    @Roles('DOCUMENT_VIEW')
    async getDocument(
        @Args('id', { type: () => ID }) id: string,
        @CurrentUser() user: any
    ) {
        return this.documentsService.findOne(id, user._id?.toString() || user.id);
    }

    @Mutation(() => DocumentTypeEntity)
    @Roles('admin')
    async createSystemDocumentType(@Args('input') input: CreateDocumentTypeInput) {
        return this.documentsService.createType(input);
    }

    @Mutation(() => DocumentStatusEntity)
    @Roles('admin')
    async createSystemDocumentStatus(@Args('input') input: CreateDocumentStatusInput) {
        return this.documentsService.createStatus(input);
    }

    @Query(() => [DocumentTypeEntity])
    async getAvailableDocumentTypes() {
        return this.documentsService.findAllTypes();
    }

    @Query(() => [DocumentStatusEntity])
    async getAvailableDocumentStatuses() {
        return this.documentsService.findAllStatuses();
    }
}