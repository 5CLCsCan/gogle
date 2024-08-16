import mongoose, { Document, Model, Schema } from 'mongoose'

interface IUser extends Document {
  username: string
  email: string
  password: string
  isVerified: boolean
  verifyToken?: string
  verifyTokenExpires?: Date
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    default: '',
  },
  verifyTokenExpires: {
    type: Date,
    default: Date.now,
  },
})

const UserModel: Model<IUser> =
  mongoose.models?.User || mongoose.model<IUser>('User', UserSchema)

export default UserModel
