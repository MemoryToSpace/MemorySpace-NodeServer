// src\app.ts
import express from 'express';
import bodyParser from 'body-parser';
import { RegisterRoutes } from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerDocument from './swagger.json';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers';
import logger from './config/logger';

// import morgan from 'morgan';

const app = express();

// Load all models
import loadModels from './config/modelLoader';
loadModels();

// CORS options
const corsOptions = {
  origin: ['https://from-memory-to-space.netlify.app', 'https://memory-to-space.netlify.app'],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use((req, res, next) => {
  logger.info(`API Request: ${req.method} ${req.url}`);
  next();
});

// Register all routes
RegisterRoutes(app);

// Swagger setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
