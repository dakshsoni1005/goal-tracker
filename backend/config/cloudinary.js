import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary if credentials are provided in env
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('\x1b[32m[Cloudinary] Cloudinary configured successfully\x1b[0m');
} else {
  console.log('\x1b[33m[Cloudinary] Credentials missing. File upload endpoints will fall back to local disk or buffer mode.\x1b[0m');
}

export default cloudinary;
