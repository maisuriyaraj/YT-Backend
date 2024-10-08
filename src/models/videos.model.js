import mongoose, { Mongoose, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String, //cloudnairy
        required: [true, 'Video is Required']
    },
    thumbnail: {
        type: String, //cloudnairy
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    duration: {
        type: Number // cloudnairy
    },
    views: {
        type: Number,
        default: 0
    },
    isPublish: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});

videoSchema.plugin(mongooseAggregatePaginate);

export const videoSchemaModel = mongoose.model('videos', videoSchema);