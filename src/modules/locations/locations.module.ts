import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import { Location, LocationSchema } from './models/location.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
    ],
    providers: [LocationsResolver, LocationsService],
    exports: [LocationsService],
})
export class LocationsModule { }