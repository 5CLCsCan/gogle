import mongoose, { ConnectOptions, Model, Document } from 'mongoose'

const MONGO_URI = process.env.MONGO_URI as string

if (!MONGO_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env.local',
  )
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extend the global object to include the mongoose cache
declare global {
  var mongoose: MongooseCache | undefined
}

global.mongoose = global.mongoose || { conn: null, promise: null }

const cached = global.mongoose

async function connectDB(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGO_URI, opts).then(mongoose => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
    console.log('DB Connected')
    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}

async function addData<T extends Document>(data: T): Promise<boolean> {
  await connectDB()
  try {
    await data.save()
    return true
  } catch (err) {
    console.error('Error saving data:', err)
    return false
  }
}

async function createData<T extends Document>(data: T): Promise<T | false> {
  await connectDB();
  try {
    const savedData = await data.save();
    return savedData;
  } catch (err) {
    console.error("Error saving data:", err);
    return false;
  }
}

async function findData<T extends Document>(
  model: Model<T>,
  query: any,
  limit: number = 0,
  skip: number | null = null,
): Promise<T[] | null> {
  await connectDB()
  try {
    let queryBuilder = model.find(query)

    if (skip !== null) queryBuilder = queryBuilder.skip(skip)
    if (limit > 0) queryBuilder = queryBuilder.limit(limit)

    const result = await queryBuilder.exec()

    if (result.length === 0) {
      return null
    }

    return result
  } catch (err) {
    console.error('Error finding data:', err)
    return null
  }
}

async function findAndUpdateData<T extends Document>(
  model: Model<T>,
  query: any,
  update: any,
): Promise<T | null> {
  await connectDB()
  try {
    return (await model.findOneAndUpdate(query, update, { new: true })) || null
  } catch (err) {
    console.error('Error finding and updating data:', err)
    return null
  }
}

async function deleteData<T extends Document>(
  model: Model<T>,
  query: any,
): Promise<boolean> {
  try {
    await model.deleteOne(query).exec()
    return true
  } catch (err) {
    console.error('Error deleting data:', err)
    return false
  }
}

export { connectDB, addData, findData, findAndUpdateData, createData, deleteData }
