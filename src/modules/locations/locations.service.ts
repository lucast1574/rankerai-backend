import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Sentry from '@sentry/nestjs';
import { Location, LocationDocument } from './models/location.model';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';

@Injectable()
export class LocationsService {
    constructor(
        @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    ) { }

    async create(createLocationInput: CreateLocationInput): Promise<LocationDocument> {
        try {
            const newLocation = new this.locationModel(createLocationInput);
            return await newLocation.save();
        } catch (error) {
            Sentry.captureException(error);
            throw new InternalServerErrorException('Failed to create location entry');
        }
    }

    async findAll(onlyActive: boolean = false): Promise<LocationDocument[]> {
        const query = onlyActive ? { active: true } : {};
        // Sort by country then name for organized lists
        return await this.locationModel.find(query).sort({ country: 1, name: 1 }).exec();
    }

    async findOne(id: string): Promise<LocationDocument> {
        const location = await this.locationModel.findById(id).exec();
        if (!location) {
            throw new NotFoundException(`Location with ID ${id} not found`);
        }
        return location;
    }

    async update(id: string, updateLocationInput: UpdateLocationInput): Promise<LocationDocument> {
        try {
            const existingLocation = await this.locationModel
                .findByIdAndUpdate(id, updateLocationInput, { new: true })
                .exec();

            if (!existingLocation) {
                throw new NotFoundException(`Location with ID ${id} not found`);
            }
            return existingLocation;
        } catch (error) {
            Sentry.captureException(error);
            throw new InternalServerErrorException('Failed to update location entry');
        }
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.locationModel.findByIdAndDelete(id).exec();
        return !!result;
    }
}