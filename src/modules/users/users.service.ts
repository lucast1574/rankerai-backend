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
     * Returns all users in the database with their roles populated.
     * Typically used for admin dashboards.
     */
    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().populate('role').exec();
    }

    /**
     * Finds a user by email and explicitly includes the password hash
     * and role for authentication purposes.
     */
    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email })
            .select('+password_hash')
            .populate('role')
            .exec();
    }

    /**
     * Finds a user by their MongoDB unique ID and populates their role.
     */
    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).populate('role').exec();
    }

    /**
     * Helper for JwtStrategy and other internal services to ensure 
     * roles are loaded for Guard verification.
     */
    async findByIdWithRole(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).populate('role').exec();
    }

    /**
     * Creates a new user. Used by Register and Admin Create flows.
     */
    async create(data: any): Promise<UserDocument> {
        const newUser = new this.userModel({
            ...data,
            is_registered: data.is_registered ?? true,
        });
        return newUser.save();
    }

    /**
     * Creates a user profile specifically from Google OAuth data.
     * Updated payload to accept the dynamic Role ObjectId.
     */
    async createFromGoogle(payload: {
        email: string;
        first_name: string;
        last_name: string;
        role?: Types.ObjectId; // Fixed: Allows Role assignment from AuthService
    }): Promise<UserDocument> {
        const newUser = new this.userModel({
            ...payload,
            auth_provider: 'GOOGLE',
            is_registered: true,
            active: true,
        });
        return newUser.save();
    }

    /**
     * Updates user profile data and returns the updated document with role.
     */
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

    /**
     * Soft delete: sets active to false but keeps the data.
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
     * Hard delete: removes the document permanently from MongoDB.
     */
    async delete(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return true;
    }

    /**
     * Records a login event by updating the timestamp and incrementing the count.
     */
    async updateLastLogin(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            $set: { last_login: new Date() },
            $inc: { no_of_login: 1 }
        });
    }
}