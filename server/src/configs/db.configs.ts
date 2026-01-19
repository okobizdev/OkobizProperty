import mongoose from "mongoose";
import { env } from "../env";

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection failed:", error.message);
    } else {
      console.error("Unknown error during database connection");
    }
    process.exit(1);
  }
};

export default connectDatabase;
