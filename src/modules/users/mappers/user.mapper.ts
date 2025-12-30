import { UserDocument } from '../models/user.model';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
    static toEntity(doc: UserDocument): UserEntity {
        const entity = new UserEntity();
        entity._id = doc._id.toString();
        entity.active = doc.active;
        entity.email = doc.email;
        entity.first_name = doc.first_name;
        entity.last_name = doc.last_name;

        // Map Role object if populated
        if (doc.role && typeof doc.role === 'object' && 'slug' in doc.role) {
            entity.role = doc.role as any;
        }

        entity.auth_provider = doc.auth_provider;
        entity.last_login = doc.last_login;
        entity.no_of_login = doc.no_of_login;
        entity.domain = doc.domain;
        entity.allow_free_trial = doc.allow_free_trial;
        entity.is_registered = doc.is_registered;
        entity.locked = doc.locked;
        entity.version = doc.version;
        entity.work_pattern = doc.work_pattern;
        entity.sitemap_url = doc.sitemap_url;

        entity.parent_id = doc.parent_id?.toString();
        entity.language_id = doc.language_id?.toString();
        entity.location_id = doc.location_id?.toString();
        entity.created_by = doc.created_by?.toString();
        entity.updated_by = doc.updated_by?.toString();

        // Accessing timestamps from Mongoose
        entity.created_on = (doc as any).created_on;
        entity.updated_on = (doc as any).updated_on;

        return entity;
    }
}