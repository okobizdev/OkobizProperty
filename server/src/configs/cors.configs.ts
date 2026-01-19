// import { CorsOptions } from "cors";
// import logger from "./logger.configs";
// import { corsWhiteList } from "../const";

// const corsConfiguration: CorsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || corsWhiteList.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       logger.warn(`Blocked CORS request from origin: ${origin}`);
//       callback(new Error("CORS not allowed"), false);
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 200,
// };

// export default corsConfiguration;


import { CorsOptions } from "cors";
import logger from "./logger.configs";
import { corsWhiteList } from "../const";

const corsConfiguration: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Allow server-to-server (no-origin) requests like from SSLCommerz, Postman, curl
      return callback(null, true);
    }

    if (corsWhiteList.includes(origin)) {
      return callback(null, true);
    }

    // Allow other origins too, but log them
    logger.warn(`⚠️ Unlisted CORS origin attempted: ${origin}`);
    return callback(null, true); // Change this to `false` if you want to block instead
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

export default corsConfiguration;
