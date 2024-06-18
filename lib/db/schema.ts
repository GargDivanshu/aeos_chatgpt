import {
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    boolean,
    foreignKey
  } from "drizzle-orm/pg-core";
  
  export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);
  
  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    email: varchar('email').unique().notNull(),
    // password: varchar('password').notNull(),
    emailConfirmed: boolean('email_confirmed').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    balance: integer('balance').default(10).notNull(),
  });
 
  
  export const teams = pgTable('teams', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    ownerId: integer('owner_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });
  
  export const teamMembers = pgTable('team_members', {
    id: serial('id').primaryKey(),
    teamId: integer('team_id').references(() => teams.id),
    userId: integer('user_id').references(() => users.id),
    role: varchar('role').default('Member').notNull(),
  });

  export type TeamMemberType = typeof all_owned_teams.$inferSelect
  
  export const conversations = pgTable('conversations', {
    id: serial('id').primaryKey(),
    teamId: integer('team_id').references(() => teams.id),
    userId: integer('user_id').references(() => users.id),
    content: varchar('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });

  export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id').references(() => conversations.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
});
  
  export const credits = pgTable('credits', {
    id: serial('id').primaryKey(),
    teamId: integer('team_id').references(() => teams.id),
    balance: integer('balance').default(0).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });
  
  // drizzle-orm
  // drizzle-kit
  