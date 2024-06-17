// db/index.ts
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, accounts, sessions, verificationTokens, teams, teamMembers, conversations, credits } from './schema'; // Ensure you import the users table schema

neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error("database url not found");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// Implement getUser function
export async function getUser(email: string) {
  try {
    const user = await db.select().from(users).where(users.email.equals(email)).execute();
    if (user.length === 0) {
      return null;
    }
    return user[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Ensure to export other relevant entities
export { users, teams, teamMembers, conversations, credits };
