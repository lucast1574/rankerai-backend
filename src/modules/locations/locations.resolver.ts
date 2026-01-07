import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { LocationEntity } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';

@Resolver(() => LocationEntity)
export class LocationsResolver {
    constructor(private readonly locationsService: LocationsService) { }

    @Public() // Public for registration and profile forms
    @Query(() => [LocationEntity], { name: 'locations', description: 'Get all available geographical locations' })
    async findAll(@Args('onlyActive', { type: () => Boolean, defaultValue: false }) onlyActive: boolean) {
        return this.locationsService.findAll(onlyActive);
    }

    @Roles('ADMIN')
    @Mutation(() => LocationEntity, { description: 'Create a new location entry (Admin only)' })
    async createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput) {
        return this.locationsService.create(createLocationInput);
    }

    @Roles('ADMIN')
    @Query(() => LocationEntity, { name: 'location', description: 'Get a specific location by ID' })
    async findOne(@Args('id', { type: () => ID }) id: string) {
        return this.locationsService.findOne(id);
    }

    @Roles('ADMIN')
    @Mutation(() => LocationEntity, { description: 'Update location details (Admin only)' })
    async updateLocation(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
        return this.locationsService.update(updateLocationInput.id, updateLocationInput);
    }

    @Roles('ADMIN')
    @Mutation(() => Boolean, { description: 'Remove a location entry (Admin only)' })
    async removeLocation(@Args('id', { type: () => ID }) id: string) {
        return this.locationsService.remove(id);
    }
}