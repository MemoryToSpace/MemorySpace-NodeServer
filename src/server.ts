// src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import { RegisterRoutes } from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import { vars } from './config/vars';
import { connectDB } from './config/connectDb';
import loadModels from './config/modelLoader';
import cors from 'cors';
import AppError from './utils/appError';

const app = express();

loadModels();

const port = vars.port || 3000;

const corsOptions = {
  origin: ['https://from-memory-to-space.netlify.app', 'https://memory-to-space.netlify.app/'],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

RegisterRoutes(app);

import swaggerDocument from '../dist/swagger.json';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
    });
  }
});

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger docs are available at http://localhost:${port}/docs`);
});
