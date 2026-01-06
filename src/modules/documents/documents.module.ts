import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';
import { Document, DocumentSchema } from './models/document.model';
import { DocumentStatus, DocumentStatusSchema } from './models/document-status.model';
import { DocumentType, DocumentTypeSchema } from './models/document-type.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Document.name, schema: DocumentSchema },
            { name: DocumentStatus.name, schema: DocumentStatusSchema },
            { name: DocumentType.name, schema: DocumentTypeSchema },
        ]),
    ],
    providers: [DocumentsService, DocumentsResolver],
    exports: [DocumentsService], // Exported for use in ProjectsModule if needed
})
export class DocumentsModule { }