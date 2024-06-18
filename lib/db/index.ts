// db/index.ts
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, accounts, sessions, verificationTokens, teams, teamMembers, conversations, credits } from './schema';


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found");
}

const connectWithRetry = async (retries = 5, delay = 1000): Promise<any> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const sql = neon(process.env.DATABASE_URL, { timeout: 5000 }); // Set a 5 seconds timeout for connection
      const db = drizzle(sql);
      // Check connection by performing a simple query
      await db.select().from(users).limit(1).execute();
      console.log('Database connection established');
      return db;
    } catch (error) {
      console.error(`Database connection failed on attempt ${attempt}. Retrying in ${delay}ms...`, error);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error('Failed to connect to database after multiple attempts');
      }
    }
  }
};

const db = await connectWithRetry();

export { db, users, teams, teamMembers, conversations, credits };
