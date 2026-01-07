import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './models/user.model';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find({ active: true })
            .populate('role')
            .exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email, active: true })
            .select('+password_hash')
            .populate('role')
            .exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ _id: id, active: true })
            .populate('role')
            .exec();
    }

    async create(data: any): Promise<UserDocument> {
        const newUser = new this.userModel({
            ...data,
            is_registered: data.is_registered ?? true,
            active: true,
        });
        const saved = await newUser.save();
        return await saved.populate('role');
    }

    async update(id: string, updateUserInput: UpdateUserInput): Promise<UserDocument> {
        const user = await this.userModel
            .findOneAndUpdate(
                { _id: id, active: true },
                { $set: updateUserInput },
                { new: true }
            )
            .populate('role')
            .exec();

        if (!user) {
            // Fix: Added .toString() to avoid template literal type error
            throw new NotFoundException(`User with ID ${id.toString()} not found or is inactive`);
        }
        return user;
    }

    async setResetToken(userId: Types.ObjectId | string, token: string): Promise<void> {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);

        const result = await this.userModel.findByIdAndUpdate(userId, {
            $set: {
                reset_password_token: token,
                reset_password_expires: expiration,
            },
        });

        if (!result) {
            // Fix: Added .toString()
            throw new NotFoundException(`User with ID ${userId.toString()} not found`);
        }
    }

    async createFromGoogle(payload: any): Promise<UserDocument> {
        const newUser = new this.userModel({
            ...payload,
            auth_provider: 'GOOGLE',
            is_registered: true,
            active: true,
        });
        const saved = await newUser.save();
        return await saved.populate('role');
    }

    async deactivate(id: string): Promise<UserDocument> {
        const user = await this.userModel
            .findByIdAndUpdate(id, { active: false }, { new: true })
            .exec();
        if (!user) throw new NotFoundException(`User with ID ${id.toString()} not found`);
        return user;
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            $set: { last_login: new Date() },
            $inc: { no_of_login: 1 }
        });
    }

    async findByIdWithRole(id: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ _id: id, active: true })
            .populate('role')
            .exec();
    }
}