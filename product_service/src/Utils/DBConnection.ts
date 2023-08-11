import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDb = async () => {
  const DB_URL =
    "mongodb+srv://vsarkar018:getmein018@nodejsprojects.1mv6s7n.mongodb.net/E-bay?retryWrites=true&w=majority";
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.log(error);
  }
};

export { connectDb };
