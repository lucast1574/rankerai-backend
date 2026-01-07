import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';
import { Document, DocumentSchema } from './models/document.model';
import { DocumentStatus, DocumentStatusSchema } from './models/document-status.model';
import { DocumentType, DocumentTypeSchema } from './models/document-type.model';
import { ProjectsModule } from '../projects/projects.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Document.name, schema: DocumentSchema },
            { name: DocumentStatus.name, schema: DocumentStatusSchema },
            { name: DocumentType.name, schema: DocumentTypeSchema },
        ]),
        ProjectsModule,
    ],
    providers: [DocumentsService, DocumentsResolver],
    exports: [DocumentsService],
})
export class DocumentsModule { }