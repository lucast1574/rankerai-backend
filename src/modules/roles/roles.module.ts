import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { Role, RoleSchema } from './models/role.model';
import { Permission, PermissionSchema } from './models/permission.model';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Role.name, schema: RoleSchema },
            { name: Permission.name, schema: PermissionSchema },
        ]),
    ],
    providers: [RolesService, RolesResolver],
    exports: [RolesService, MongooseModule],
})
export class RolesModule { }