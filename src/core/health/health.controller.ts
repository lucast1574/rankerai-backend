import { Controller, Get } from '@nestjs/common';
import {
    HealthCheckService,
    MongooseHealthIndicator,
    MemoryHealthIndicator,
    HealthCheck
} from '@nestjs/terminus';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: MongooseHealthIndicator,
        private memory: MemoryHealthIndicator,
    ) { }

    @Get()
    @Public() // Accessible without JWT
    @HealthCheck()
    check() {
        return this.health.check([
            // 1. Database Connection: Ensures MongoDB is reachable
            () => this.db.pingCheck('database'),

            // 2. Heap Limit: Checks if the heap usage is above a threshold (e.g., 150MB)
            // This is crucial for preventing crashes in containerized environments.
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

            // 3. RSS Limit: Checks the total process resident set size
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
        ]);
    }
}