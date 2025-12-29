import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver'; // Add this
import { User, UserSchema } from './models/user.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [UsersService, UsersResolver], // Add UsersResolver here
    exports: [UsersService],
})
export class UsersModule { }