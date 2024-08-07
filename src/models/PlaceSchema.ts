import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for the Place document
export interface IPlace extends Document {
  address: string;
  category: string;
  detailUrl?: string;
  id: number;
  imgLink: string;
  latitude: number;
  longitude: number;
  gridX: number,
  gridY: number,
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
    type: Number,
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
  gridX: {
    type: Number,
    required: true,
  },
  gridY: {
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
const Places: Model<IPlace> = mongoose.models.places_tests || mongoose.model<IPlace>('places_tests', PlaceSchema);

export default Places;