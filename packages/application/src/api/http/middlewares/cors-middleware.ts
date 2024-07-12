import cors, { CorsOptions } from 'cors';

const whitelist = ["http://localhost:3000"];

const corsOptions: CorsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export const corsMiddleware = cors(corsOptions);