import dotenv from 'dotenv';
dotenv.config();

const config = {
  env:       process.env.NODE_ENV || 'development',
  port:      process.env.PORT || 3000,
  mongoUri:  process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  isDev:     process.env.NODE_ENV === 'development',
  isProd:    process.env.NODE_ENV === 'production',
};

const required = ['MONGO_URI', 'JWT_SECRET'];
required.forEach(key => {
  if (!process.env[key]) throw new Error(`❌ Variable faltante: ${key}`);
});

export default config;