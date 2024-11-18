import mysql from 'mysql2/promise';
import { configDotenv } from 'dotenv';

configDotenv();

let connection;

const dbConnect = async () => {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error.message);
      process.exit(1);
    }
  }
  return connection;
};

export default dbConnect;
