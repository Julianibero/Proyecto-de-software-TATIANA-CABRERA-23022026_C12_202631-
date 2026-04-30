import mongoose from 'mongoose';
import config from './env.js';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(config.mongoUri, {
      dbName: 'talento_sin_fronteras',
    });

    console.log(`✅ MongoDB conectado [${config.env}]`);

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error en MongoDB:', err.message);
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;