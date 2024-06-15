import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';




// Define the interface for the Trip document
export interface ITrip extends Document {
  userEmail: string;
  startDate: Date;
  startTime: string;
  locations?: string[];
  sharedEmails: string[];
  userState?: UserState;
  userFilter?: UserFilter;
}

// Define the schema for the Trip model
const TripSchema: Schema<ITrip> = new Schema({
  userEmail: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: String,
    required: true,
  },
  locations: {
    type: [String],
    required: false,
  },
  sharedEmails: [
    {
      type: String,
    },
  ],
});

// Define the Trip model
const TripModel: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);

export default TripModel;
