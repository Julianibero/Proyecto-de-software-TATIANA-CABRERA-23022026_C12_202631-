import config from './config/env.js';
import express from 'express';
import helmet from 'helmet';
import connectDB from './config/dataBase.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));

connectDB();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.json({ message: `API corriendo ✅ [${config.env}]` }));

app.listen(config.port, () => {
  console.log(`🚀 Servidor en http://localhost:${config.port} [${config.env}]`);
});