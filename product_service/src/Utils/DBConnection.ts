import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDb = async () => {
  const DB_URL = "mongodb://localhost:27017/E-Bay";
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.log(error);
  }
};

export { connectDb };
