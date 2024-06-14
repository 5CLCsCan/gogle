import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserState extends Document {
    satiation: number;
    thirsty: number;
    tiredness: number;
}

interface ICategory extends Document {
    type: string;
    name: string;
    value: string[];
    point?: IUserState;
}

const UserStateSchema: Schema<IUserState> = new mongoose.Schema({
    satiation: {
        type: Number,
        required: true,
    },
    thirsty: {
        type: Number,
        required: true,
    },
    tiredness: {
        type: Number,
        required: true,
    },
});

const CategorySchema: Schema<ICategory> = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    value: {
        type: [String],
        required: true,
    },
    point: {
        type: UserStateSchema,
        required: false,
    },
});

export const CategoryModel: Model<ICategory> = mongoose.models?.Category || mongoose.model<ICategory>('Category', CategorySchema);