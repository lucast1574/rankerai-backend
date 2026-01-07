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

    /**
     * Finds all users that are currently active in the database.
     */
    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find({ active: true })
            .populate('role')
            .exec();
    }

    /**
     * Finds an active user by email and explicitly includes the password hash for auth.
     */
    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email, active: true })
            .select('+password_hash')
            .populate('role')
            .exec();
    }

    /**
     * Finds an active user by their unique ID.
     */
    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ _id: id, active: true })
            .populate('role')
            .exec();
    }

    /**
     * Alias for findById to maintain consistency with other services.
     */
    async findByIdWithRole(id: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ _id: id, active: true })
            .populate('role')
            .exec();
    }

    /**
     * Creates a new user and awaits the population of the role reference.
     */
    async create(data: any): Promise<UserDocument> {
        const newUser = new this.userModel({
            ...data,
            is_registered: data.is_registered ?? true,
            active: true, // Ensure new users are active by default
        });
        const saved = await newUser.save();
        // Await populate ensures the returned object contains the full role data
        return await saved.populate('role');
    }

    /**
     * Handles user creation specifically for Google OAuth providers.
     */
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
        const saved = await newUser.save();
        return await saved.populate('role');
    }

    /**
     * Updates an active user's details.
     */
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
            throw new NotFoundException(`User with ID ${id} not found or is inactive`);
        }
        return user;
    }

    /**
     * Soft-deletes a user by setting active to false.
     */
    async deactivate(id: string): Promise<UserDocument> {
        const user = await this.userModel
            .findByIdAndUpdate(id, { active: false }, { new: true })
            .exec();

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    /**
     * Performs a hard delete from the database.
     */
    async delete(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return true;
    }

    /**
     * Updates audit logs for user logins.
     */
    async updateLastLogin(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            $set: { last_login: new Date() },
            $inc: { no_of_login: 1 }
        });
    }
}