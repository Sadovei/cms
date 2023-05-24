import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Do something before save to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    // Salt is random data that is used as an additional input 
    // to a one - way function that hashes data, a password or passphrase
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;