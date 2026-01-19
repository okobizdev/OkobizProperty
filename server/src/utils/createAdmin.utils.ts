import mongoose from "mongoose";
import { env } from "../env";
import User from "../modules/user/user.model";

(async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("❌ Admin user already exists.");
    } else {
      await User.create({
        email: env.ADMIN_EMAIL,
        name: env.ADMIN_NAME,
        password: env.ADMIN_PASSWORD,
        role: "admin",
        isVerified: true,
      });
      console.log("✅ Admin user created successful.");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
})();
