const { execSync } = require("child_process");
const dotenv = require("dotenv");

dotenv.config();

const env = process.env.NODE_ENV;

if (env === "production") {
  console.log("📦 [create-admin] Running in production...");
  execSync("node ./dist/scripts/createAdmin.utils.js", { stdio: "inherit" });
} else {
  console.log("🧪 [create-admin] Running in development...");
  execSync("ts-node ./src/utils/createAdmin.utils.ts", { stdio: "inherit" });
}
