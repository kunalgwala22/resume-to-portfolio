import app from './app';
import { env } from './config/env';
import prisma from './config/database';
import { connectRedis } from './config/redis';

const server = app.listen(env.PORT, async () => {
  console.log(`🚀 PortfolioVerse API Server running on port ${env.PORT}`);

  try {
    // Initialize Postgres Connection
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully');

    // Initialize Redis Connection
    await connectRedis();
  } catch (error) {
    console.error('❌ Startup connection pool failures:', error);
  }
});

// Graceful Shutdown Manager
const handleExit = async (signal: string) => {
  console.log(`\nReceived ${signal}. Initiating graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed.');
    
    try {
      await prisma.$disconnect();
      console.log('PostgreSQL database disconnected.');
      
      // Dynamic import to avoid premature init
      const redisClient = (await import('./config/redis')).default;
      if (redisClient.isOpen) {
        await redisClient.quit();
        console.log('Redis connection closed.');
      }
      
      console.log('👋 Clean exit accomplished.');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown processes:', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGINT', () => handleExit('SIGINT'));
