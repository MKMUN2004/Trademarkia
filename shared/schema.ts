import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define trademark classifications
export const trademarkClassifications = [
  { id: 1, name: "Class 1: Chemicals", color: "blue" },
  { id: 2, name: "Class 2: Paints", color: "red" },
  { id: 3, name: "Class 3: Cosmetics & Cleaning Preparations", color: "pink" },
  { id: 4, name: "Class 4: Lubricants & Fuels", color: "gray" },
  { id: 5, name: "Class 5: Pharmaceuticals", color: "green" },
  { id: 6, name: "Class 6: Metal Goods", color: "slate" },
  { id: 7, name: "Class 7: Machinery", color: "zinc" },
  { id: 8, name: "Class 8: Hand Tools", color: "stone" },
  { id: 9, name: "Class 9: Electrical & Scientific Apparatus", color: "blue" },
  { id: 10, name: "Class 10: Medical Apparatus", color: "sky" },
  { id: 11, name: "Class 11: Environmental Control Apparatus", color: "cyan" },
  { id: 12, name: "Class 12: Vehicles", color: "teal" },
  { id: 13, name: "Class 13: Firearms", color: "red" },
  { id: 14, name: "Class 14: Jewelry", color: "amber" },
  { id: 15, name: "Class 15: Musical Instruments", color: "yellow" },
  { id: 16, name: "Class 16: Paper Goods & Printed Matter", color: "lime" },
  { id: 17, name: "Class 17: Rubber Goods", color: "emerald" },
  { id: 18, name: "Class 18: Leather Goods", color: "orange" },
  { id: 19, name: "Class 19: Non-metallic Building Materials", color: "stone" },
  { id: 20, name: "Class 20: Furniture & Articles Not Otherwise Classified", color: "amber" },
  { id: 21, name: "Class 21: Housewares & Glass", color: "indigo" },
  { id: 22, name: "Class 22: Cordage & Fibers", color: "violet" },
  { id: 23, name: "Class 23: Yarns & Threads", color: "purple" },
  { id: 24, name: "Class 24: Fabrics", color: "fuchsia" },
  { id: 25, name: "Class 25: Clothing", color: "pink" },
  { id: 26, name: "Class 26: Fancy Goods", color: "rose" },
  { id: 27, name: "Class 27: Floor Coverings", color: "sky" },
  { id: 28, name: "Class 28: Toys & Sporting Goods", color: "blue" },
  { id: 29, name: "Class 29: Meats & Processed Foods", color: "red" },
  { id: 30, name: "Class 30: Staple Foods", color: "amber" },
  { id: 31, name: "Class 31: Natural Agricultural Products", color: "green" },
  { id: 32, name: "Class 32: Light Beverages", color: "sky" },
  { id: 33, name: "Class 33: Wines & Spirits", color: "purple" },
  { id: 34, name: "Class 34: Smokers' Articles", color: "gray" },
  { id: 35, name: "Class 35: Advertising & Business", color: "zinc" },
  { id: 36, name: "Class 36: Insurance & Financial", color: "green" },
  { id: 37, name: "Class 37: Building Construction & Repair", color: "orange" },
  { id: 38, name: "Class 38: Telecommunications", color: "yellow" },
  { id: 39, name: "Class 39: Transportation & Storage", color: "amber" },
  { id: 40, name: "Class 40: Treatment of Materials", color: "lime" },
  { id: 41, name: "Class 41: Education & Entertainment", color: "indigo" },
  { id: 42, name: "Class 42: Computer & Scientific", color: "purple" },
  { id: 43, name: "Class 43: Hotels & Restaurants", color: "orange" },
  { id: 44, name: "Class 44: Medical, Beauty & Agricultural", color: "emerald" },
  { id: 45, name: "Class 45: Personal & Legal", color: "blue" }
];

// Define trademark status options
export const trademarkStatuses = [
  { id: 1, name: "Registered", color: "green" },
  { id: 2, name: "Pending", color: "blue" },
  { id: 3, name: "Abandoned", color: "red" },
  { id: 4, name: "Cancelled", color: "gray" },
  { id: 5, name: "Expired", color: "amber" },
  { id: 6, name: "Opposition", color: "orange" }
];

// Define the law firms table
export const lawFirms = pgTable("law_firms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Define the attorneys table
export const attorneys = pgTable("attorneys", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  lawFirmId: integer("law_firm_id").references(() => lawFirms.id),
});

// Define the owners table
export const owners = pgTable("owners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Define the trademarks table
export const trademarks = pgTable("trademarks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  filingDate: date("filing_date"),
  registrationDate: date("registration_date"),
  description: text("description"),
  ownerId: integer("owner_id").references(() => owners.id),
  statusId: integer("status_id").notNull(),
  attorneyId: integer("attorney_id").references(() => attorneys.id),
  lawFirmId: integer("law_firm_id").references(() => lawFirms.id),
  searchCount: integer("search_count").default(0),
});

// Define the classifications_to_trademarks junction table
export const classificationsToTrademarks = pgTable("classifications_to_trademarks", {
  id: serial("id").primaryKey(),
  trademarkId: integer("trademark_id").references(() => trademarks.id),
  classificationId: integer("classification_id").notNull(),
});

// Define the waitlist table
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { mode: 'string' }).notNull().defaultNow(),
});

// Create schema for inserting into the waitlist
export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true,
});

// Types for database models
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export type LawFirm = typeof lawFirms.$inferSelect;
export type Attorney = typeof attorneys.$inferSelect;
export type Owner = typeof owners.$inferSelect;
export type Trademark = typeof trademarks.$inferSelect;

// Extended type for trademark with related entities
export interface TrademarkWithRelations extends Trademark {
  owner: Owner;
  attorney: Attorney | null;
  lawFirm: LawFirm | null;
  classifications: number[];
}

// Search params type
export const searchParamsSchema = z.object({
  query: z.string().optional(),
  ownerFilter: z.string().optional(),
  lawFirmFilter: z.string().optional(),
  attorneyFilter: z.string().optional(),
  statusFilter: z.string().optional(),
  filingDateFrom: z.string().optional(),
  filingDateTo: z.string().optional(),
  registrationNumber: z.string().optional(),
  sortBy: z.string().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

// Search results type
export interface SearchResults {
  trademarks: TrademarkWithRelations[];
  total: number;
  page: number;
  perPage: number;
  query: string;
}

// Define the users table (keeping from original file)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
