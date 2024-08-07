import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';

export interface ITrip extends Document {
  userID: string;
  tripName: string;
  locationsID: string[];
  userState: UserState;
  userFilter: UserFilter;
  last_latitude: number;
  last_longitude: number;
}

const TripSchema: Schema<ITrip> = new Schema({
  userID: {
    type: String,
    required: true,
  },
  tripName: {
    type: String,
    required: true,
  },
  locationsID: {
    type: [String],
    required: false,
    default: [],
  },
  userState: {
    type: Schema.Types.Mixed,
    required: false,
    default: new UserState(),
  },
  userFilter: {
    type: Schema.Types.Mixed,
    required: false,
  },
  last_latitude: {
    type: Number,
    required: false,
    default: 0,
  },
  last_longitude: {
    type: Number,
    required: false,
    default: 0,
  },
});

const TripModel: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);

export default TripModel;
