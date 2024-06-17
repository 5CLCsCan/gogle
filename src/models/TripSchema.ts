import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserState } from '@/lib/backend/recommendation/category/userState';
import { UserFilter } from '@/lib/backend/recommendation/category/userFilter';

export interface ITrip extends Document {
  userID: string;
  locations: string[];
  locationsCategory: string[];
  userState: UserState;
  userFilter: UserFilter;
}

const TripSchema: Schema<ITrip> = new Schema({
  userID: {
    type: String,
    required: true,
  },
  locations: {
    type: [String],
    required: false,
    default: [],
  },
  locationsCategory: {
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
});

const TripModel: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);

export default TripModel;
