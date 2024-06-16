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
//   open_0: number,
//   open_1: number,
//   open_2: number,
//   open_3: number,
//   open_4: number,
//   open_5: number,
//   open_6: number,
//   open_7: number,
//   open_8: number,
//   open_9: number,
//   open_10: number,
//   open_11: number,
//   open_12: number,
//   open_13: number,
//   open_14: number,
//   open_15: number,
//   open_16: number,
//   open_17: number,
//   open_18: number,
//   open_19: number,
//   open_20: number,
//   open_21: number,
//   open_22: number,
//   open_23: number,

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
    // open_0: {
    //     type: Number,
    //     required: true,
    // },
    // open_1: {
    //     type: Number,
    //     required: true,
    // },
    // open_2: {
    //     type: Number,
    //     required: true,
    // },
    // open_3: {
    //     type: Number,
    //     required: true,
    // },
    // open_4: {
    //     type: Number,
    //     required: true,
    // },
    // open_5: {
    //     type: Number,
    //     required: true,
    // },
    // open_6: {
    //     type: Number,
    //     required: true,
    // },
    // open_7: {
    //     type: Number,
    //     required: true,
    // },
    // open_8: {
    //     type: Number,
    //     required: true,
    // },
    // open_9: {
    //     type: Number,
    //     required: true,
    // },
    // open_10: {
    //     type: Number,
    //     required: true,
    // },  
    // open_11: {
    //     type: Number,
    //     required: true,
    // },
    // open_12: {
    //     type: Number,
    //     required: true,
    // },
    // open_13: {
    //     type: Number,
    //     required: true,
    // },
    // open_14: {
    //     type: Number,
    //     required: true,
    // },
    // open_15: {
    //     type: Number,
    //     required: true,
    // },
    // open_16: {
    //     type: Number,
    //     required: true,
    // },
    // open_17: {
    //     type: Number,
    //     required: true,
    // },
    // open_18: {
    //     type: Number,
    //     required: true,
    // },
    // open_19: {
    //     type: Number,
    //     required: true,
    // },
    // open_20: {
    //     type: Number,
    //     required: true,
    // },
    // open_21: {
    //     type: Number,
    //     required: true,
    // },
    // open_22: {
    //     type: Number,
    //     required: true,
    // },
    // open_23: {
    //     type: Number,
    //     required: true,
    // },
});

// Define the Place model
const Places: Model<IPlace> = mongoose.models.places_tests || mongoose.model<IPlace>('places_tests', PlaceSchema);

export default Places;