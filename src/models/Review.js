import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v;
        }
    },
    toObject: {
        transform: (doc, ret) => {
        }
    }
});

class ReviewClass {
}

ReviewSchema.loadClass(ReviewClass);

const Review = mongoose.model('Review', ReviewSchema);

export default Review;