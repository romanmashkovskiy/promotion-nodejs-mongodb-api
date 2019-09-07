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
    },
    resetPasswordCode: {
        type: String,
        default: null
    },
    confirmEmailCode: {
        type: String,
        default: null
    },
    isConfirmed: {
        type: Boolean,
        default: false,
        required: true
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.password;
            delete ret.resetPasswordCode;
            delete ret.confirmEmailCode;
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

    verifyResetPasswordCode(code) {
        return code.length === 4 && this.resetPasswordCode === code;
    }

    verifyConfirmEmailCode(code) {
        return code.length === 4 && this.confirmEmailCode === code;
    }

    async sendResetPasswordCode() {
        this.resetPasswordCode = Math.random().toString(36).substring(2, 6);
        if (env.DEBUG === 'true') {
            console.log(
                this.email,
                'no-reply@inspectagram.net',
                'Reset password',
                `Reset code is: ${ this.resetPasswordCode }`
            );
        } else {

        }
        await this.save();
    }

    async sendConfirmEmailCode() {
        this.confirmEmailCode = Math.random().toString(36).substring(2, 6);
        if (env.DEBUG === 'true') {
            console.log(
                this.email,
                'no-reply@inspectagram.net',
                'Email confirmation',
                `Verification code is: ${ this.confirmEmailCode }`
            );
        } else {

        }
        await this.save();
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

    this.wasModifiedEmail = this.isModified('email');
    if (this.wasModifiedEmail) {
        this.confirmEmailCode = Math.random().toString(36).substring(2, 6);
        this.isConfirmed = false;
    }
});

UserSchema.post('save', async function(doc) {
    if (doc.wasModifiedEmail) {
        const subject = 'Confirm Your Email';
        if (env.DEBUG === 'true') {
            console.log(
                this.email,
                env.EMAIL_FROM,
                subject,
                `Your verification code is: ${ this.confirmEmailCode }`
            );
        } else {

        }
    }
});

UserSchema.plugin(uniqueValidator, { message: 'This {PATH} has already been registered.' });

const User = mongoose.model('User', UserSchema);

export default User;