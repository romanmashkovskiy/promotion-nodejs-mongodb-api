import jwt from 'jsonwebtoken';
import env from '../config/env';
import { pick } from 'lodash';
import { generateHash, validateHash } from '../utils/hash';
import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: {
            unique: true
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'Password is too short'],
        maxLength: [25, 'Password is too long'],
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    toObject: {
        transform: (doc, ret) => {
            delete ret.password;
        }
    },
});

class UserClass {
    getTokenData() {
        return pick(this, ['id', 'email']);
    };

    getToken() {
        return jwt.sign(this.getTokenData(), env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    };

    verifyPassword(candidatePassword) {
        return validateHash(candidatePassword, this.password);
    }

    static findByEmail(email) {
        return this.findOne({ email });
    }
}

UserSchema.loadClass(UserClass);

UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await generateHash(this.password, 10);
    }
});

UserSchema.plugin(uniqueValidator, { message: 'This {PATH} has already been registered.' });

const User = mongoose.model('User', UserSchema);

export default User;