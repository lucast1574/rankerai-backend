import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
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
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

// Note: We import the Class 'Document' to avoid the 'isolatedModules' metadata error
import { Document } from './models/document.model';

@Resolver(() => DocumentEntity)
export class DocumentsResolver {
    constructor(private readonly documentsService: DocumentsService) { }

    // --- Field Resolvers (Populate references dynamically) ---

    @ResolveField('status', () => DocumentStatusEntity)
    async getStatus(@Parent() document: Document) {
        // We cast to any or use the ID property directly from the parent
        const doc = document as any;
        return this.documentsService.findStatusById(doc.status_id.toString());
    }

    @ResolveField('type', () => DocumentTypeEntity)
    async getType(@Parent() document: Document) {
        const doc = document as any;
        return this.documentsService.findTypeById(doc.type_id.toString());
    }

    // --- User Operations ---

    @UseGuards(GqlAuthGuard)
    @Mutation(() => DocumentEntity)
    async createDocument(
        @Args('input') input: CreateDocumentInput,
        @CurrentUser() user: any
    ) {
        return this.documentsService.create(input, user.id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [DocumentEntity], { name: 'getDocuments' })
    async getDocuments(
        @Args('filter', { nullable: true }) filter: DocumentFilterInput,
        @CurrentUser() user: any
    ) {
        return this.documentsService.findAll(filter || {}, user.id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => DocumentEntity, { name: 'getDocument' })
    async getDocument(
        @Args('id') id: string,
        @CurrentUser() user: any
    ) {
        return this.documentsService.findOne(id, user.id);
    }

    // --- Admin Operations (System Constants) ---

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation(() => DocumentTypeEntity)
    async createSystemDocumentType(@Args('input') input: CreateDocumentTypeInput) {
        return this.documentsService.createType(input);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation(() => DocumentStatusEntity)
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