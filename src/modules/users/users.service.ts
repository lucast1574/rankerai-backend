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
        return this.userModel.find().populate('role').exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email })
            .select('+password_hash')
            .populate('role')
            .exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).populate('role').exec();
    }

    async findByIdWithRole(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).populate('role').exec();
    }

    async create(data: any): Promise<UserDocument> {
        const newUser = new this.userModel({
            ...data,
            is_registered: data.is_registered ?? true,
        });
        return newUser.save();
    }

    async createFromGoogle(payload: {
        email: string;
        first_name: string;
        last_name: string;
        role?: Types.ObjectId;
    }): Promise<UserDocument> {
        const newUser = new this.userModel({
            ...payload,
            auth_provider: 'GOOGLE',
            is_registered: true,
            active: true,
        });
        return newUser.save();
    }

    async update(id: string, updateUserInput: UpdateUserInput): Promise<UserDocument> {
        const user = await this.userModel
            .findByIdAndUpdate(id, { $set: updateUserInput }, { new: true })
            .populate('role')
            .exec();

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async deactivate(id: string): Promise<UserDocument> {
        const user = await this.userModel
            .findByIdAndUpdate(id, { active: false }, { new: true })
            .exec();

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return true;
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            $set: { last_login: new Date() },
            $inc: { no_of_login: 1 }
        });
    }
}