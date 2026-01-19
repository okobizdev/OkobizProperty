import dotenv from "dotenv";
import app from "./src/app";
import connectDatabase from "./src/configs/db.configs";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        `\nServer startup failed!\n-----------------------------\nError Name: ${
          error.name
        }\nError Message: ${
          error.message
        }\nTime: ${new Date().toLocaleString()}\n⏳ Please check your database configuration or network.
        `
      );
    } else {
      console.error(`\nUnknown error during server connection\n----------------------------------------\nTime: ${new Date().toLocaleString()}\nPlease investigate the issue further.\n----------------------------------------
        `);
    }
    process.exit(1);
  }
})();
