import cors, { CorsOptions } from 'cors'

const whitelist = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://allocator-rkh-backend-utcn6.ondigitalocean.app',
]

const corsOptions: CorsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

export const corsMiddleware = cors(corsOptions)
