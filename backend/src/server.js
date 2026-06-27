import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import startMonitoring from './jobs/monitoring.job.js';

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();
    
    // Start background monitoring jobs
    startMonitoring();

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
