import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection, ConnectionStates } from 'mongoose';
import databaseConfig from '../../config/database.config';

describe('MongoDB Connection (Integration)', () => {
    let connection: Connection;
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [databaseConfig],
                }),
                MongooseModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: (config: ConfigService) => ({
                        uri: config.get<string>('database.uri'),
                    }),
                }),
            ],
        }).compile();

        connection = app.get<Connection>(getConnectionToken());
    }, 15000); // Increased timeout for Atlas cloud connection

    it('should establish a successful connection to MongoDB Atlas', () => {
        // 1 means connected, 2 means connecting
        const isConnected = connection.readyState === ConnectionStates.connected;

        console.log(`[DB TEST] Current Connection State: ${connection.readyState}`);
        console.log(`[DB TEST] Database Name: ${connection.name}`);

        expect(isConnected).toBe(true);
    });

    it('should be able to perform a basic ping command', async () => {
        const admin = connection.db!.admin();
        const result = await admin.ping();
        expect(result).toBeDefined();
        expect(result.ok).toBe(1);
    });

    afterAll(async () => {
        if (connection) {
            await connection.close();
        }
        await app.close();
    });
});