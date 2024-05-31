import mongoose from "mongoose";

const connectDB = async () => {
  if(mongoose.connections[0].readyState){
    return true;
  }

  try {
    //console.log('Connecting to Mongodb')
    const db_URI = process.env.MONGO_URI;
    await mongoose.connect(db_URI);
    console.log('Mongodb connected')
    return true;
  } catch (error) {
    console.log('Mongodb connection failed')
    //console.log(error)
  }
}


export default connectDB;