import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for the Place document
export interface IPlace extends Document {
  address: string;
  category: string;
  detailUrl?: string;
  id: string;
  imgLink: string;
  latitude: number;
  longitude: number;
  name: string;
  openingTime: string[][][];
  priceRange: number[];
}

// Define the schema for the Place model
const PlaceSchema: Schema<IPlace> = new Schema({
  address: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  detailUrl: {
    type: String,
    required: false,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  imgLink: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  openingTime: {
    type: [[[String]]], 
    required: true,
  },
  priceRange: {
    type: [Number],
    required: true,
  },
});

// Define the Place model
const Places: Model<IPlace> = mongoose.models.Places || mongoose.model<IPlace>('Places', PlaceSchema);

export default Places;