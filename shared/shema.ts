import { pgTable, text, serial, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  sport: text("sport").notNull(),
  year: integer("year").notNull(),
  brand: text("brand").notNull(),
  cardSet: text("card_set").default(""),
  condition: text("condition").notNull(),
  purchasePrice: doublePrecision("purchase_price").default(0),
  currentValue: doublePrecision("current_value").default(0),
  notes: text("notes").default(""),
  imageUrl: text("image_url").default(""),
  cardNumber: text("card_number").default(""),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCardSchema = createInsertSchema(cards)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    // Make these fields optional with defaults to handle missing data
    cardSet: z.string().optional().default(""),
    currentValue: z.number().optional().default(0),
    notes: z.string().optional().default(""),
    imageUrl: z.string().optional().default(""),
    cardNumber: z.string().optional().default(""),
    userId: z.number().optional().nullable(),
    // Allow fallback values for required fields in case they're missing
    purchasePrice: z.coerce.number().default(0),
  });

export const cardSortOptions = [
  { label: "Recent", value: "recent" },
  { label: "Player Name (A-Z)", value: "playerNameAsc" },
  { label: "Player Name (Z-A)", value: "playerNameDesc" },
  { label: "Value (High-Low)", value: "valueDesc" },
  { label: "Value (Low-High)", value: "valueAsc" },
  { label: "Year (New-Old)", value: "yearDesc" },
  { label: "Year (Old-New)", value: "yearAsc" },
] as const;

export const sportOptions = [
  { label: "All Sports", value: "all" },
  { label: "Soccer", value: "soccer" },
  { label: "Baseball", value: "baseball" },
  { label: "Basketball", value: "basketball" },
  { label: "Football", value: "football" },
  { label: "Hockey", value: "hockey" },
  { label: "Other", value: "other" },
] as const;

export const conditionOptions = [
  { label: "All Conditions", value: "all" },
  { label: "Raw", value: "raw" },
  { label: "PSA 10", value: "psa10" },
  { label: "PSA 9", value: "psa9" },
  { label: "PSA 8", value: "psa8" },
  { label: "PSA 7", value: "psa7" },
  { label: "BGS 9.5", value: "bgs95" },
  { label: "BGS 9", value: "bgs9" },
  { label: "BGS 8.5", value: "bgs85" },
] as const;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
export type CardSort = typeof cardSortOptions[number]["value"];
export type Sport = typeof sportOptions[number]["value"];
export type Condition = typeof conditionOptions[number]["value"];

