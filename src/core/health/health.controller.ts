import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { Public } from '../../shared/decorators/public.decorator'; // Existing decorator

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: MongooseHealthIndicator,
    ) { }

    @Get()
    @Public() // Allow access without JWT
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.db.pingCheck('database'), // Ensures MongoDB connection is alive
        ]);
    }
}