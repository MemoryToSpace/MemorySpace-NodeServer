import { vars } from './config/vars';
import { connectDB } from './config/connectDb';
import app from './app';
import logger from './config/logger';

const port = vars.port || 3000;

// Connect to the database
connectDB();

// Create a heapdump on unhandledRejection
process.on('unhandledRejection', (reason, _promise) => {
  logger.error('Unhandled Rejection:', reason);
  // יצירת heapdump יכולה להתבצע כאן בעתיד במידה ונדרש
});

// Initialize and start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Swagger docs are available at http://localhost:${port}/docs`);
});
