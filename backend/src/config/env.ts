const env = {
  Node_Env: process.env.MONGODB_URI?.toString() || 'development',
  MongoDB_URI: process.env.MONGODB_URI?.toString() || '',
  DB_Name: process.env.DB_NAME?.toString() || '',
  Access_Token_Secret: process.env.ACCESS_TOKEN_SECRET?.toString() || '',
  Access_Token_Expires_In: process.env.ACCESS_TOKEN_EXPIRES_IN?.toString() || '',
  Refresh_Token_Secret: process.env.REFRESH_TOKEN_SECRET?.toString() || '',
  Refresh_Token_Expires_In: process.env.REFRESH_TOKEN_EXPIRES_IN?.toString() || '',
  Client_URLs: process.env.CLIENT_URLS?.toString()?.split(',') || '',
  Debug: process.env.DEBUG?.toString() || 'app:development',
  Cloudinary_Cloud_Name: process.env.CLOUDINARY_CLOUD_NAME?.toString() || '',
  Cloudinary_API_Key: process.env.CLOUDINARY_API_KEY?.toString() || '',
  Cloudinary_Api_Secret: process.env.CLOUDINARY_API_SECRET?.toString() || '',
};

export default env;
