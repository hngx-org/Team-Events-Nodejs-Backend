import express, { Express } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import index from './Routes/index';
import swaggerDocument from '../swagger';
import connectDB from './config/connect.db';
config();

// App Init
const app: Express = express();
// Connect to DB
connectDB();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api', index);

const PORT: number = Number(process.env.PORT) || 8080;
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default server;
