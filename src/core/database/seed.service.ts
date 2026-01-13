import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Importamos Types
import { Role } from '../../modules/roles/models/role.model';
import { SubscriptionPlan } from '../../modules/subscriptions/models/subscription-plan.model';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectModel(Role.name) private roleModel: Model<Role>,
        @InjectModel(SubscriptionPlan.name) private planModel: Model<SubscriptionPlan>,
    ) { }

    async onApplicationBootstrap() {
        this.logger.log('Checking database seed data...');
        try {
            await this.seedRoles();
            await this.seedPlans();
        } catch (error) {
            this.logger.error('Error during seeding:', error);
        }
        this.logger.log('Seed process finished.');
    }

    private async seedRoles() {
        const roles = [
            { name: 'User', slug: 'user', description: 'Standard user', permissions: [] },
            { name: 'Admin', slug: 'admin', description: 'Administrator', permissions: [] },
        ];

        for (const role of roles) {
            const existing = await this.roleModel.findOne({ slug: role.slug });
            if (!existing) {
                this.logger.log(`Creating role: ${role.slug}`);
                // Generamos el ID manualmente para evitar el error de Mongoose
                await this.roleModel.create({ ...role, _id: new Types.ObjectId() });
            }
        }
    }

    private async seedPlans() {
        const freePlan = await this.planModel.findOne({ slug: 'free' });

        if (!freePlan) {
            this.logger.log('Creating default "Free" plan...');

            // Creamos el objeto con el ID generado manualmente
            const planData = {
                _id: new Types.ObjectId(), // ESTO SOLUCIONA EL ERROR
                name: 'Free Plan',
                slug: 'free',
                credits: 10,
                active: true,
                is_enabled: true,
                features: {},
                version: 0
            };

            await this.planModel.create(planData);
            this.logger.log('✅ Default "Free" plan created successfully');
        }
    }
}