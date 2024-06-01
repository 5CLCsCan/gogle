import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}


async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
    console.log("DB Connected");
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}


async function addData(data) {
  try {
    await data.save();
    return true;
  } catch (err) {
    return false;
  }
}


async function findData(model, query) {
  try {
    return await model.find(query);
  } catch (err) {
    console.log(err);
    return false;
  }
}


async function findAndUpdateData(model, query, update) {
  try {
    return await model.findOneAndUpdate(query, update, { new: true }) || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}



export { connectDB, addData, findData, findAndUpdateData };