import app from './app';
import { vars } from './config/vars';
import { connectDB } from './config/connectDb';

const port = vars.port || 3000;

// Connect to the database
connectDB();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger docs are available at http://localhost:${port}/docs`);
});
