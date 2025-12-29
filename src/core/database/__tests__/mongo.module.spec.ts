import { Test, TestingModule } from '@nestjs/testing';
import { MongoModule } from '../mongo.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../../config/database.config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('MongoModule (Unit)', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [databaseConfig],
                }),
                MongoModule,
            ],
        }).compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide a mongoose connection', () => {
        const connection = module.get<Connection>(getConnectionToken());
        expect(connection).toBeDefined();
    });

    afterAll(async () => {
        const connection = module.get<Connection>(getConnectionToken());
        await connection.close();
    });
});