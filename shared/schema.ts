import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User Model with role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["homemaker", "customer"] }).notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  location: text("location"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  skills: many(skills),
  listings: many(listings),
  reviews: many(reviews, { relationName: "reviewAuthor" }),
  receivedReviews: many(reviews, { relationName: "reviewRecipient" }),
  orders: many(orders, { relationName: "customer" }),
  receivedOrders: many(orders, { relationName: "homemaker" }),
}));

// Skills Model for homemakers
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  homemakerId: integer("homemaker_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  name: text("name").notNull(),
  level: integer("level").notNull(),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verificationDetails: jsonb("verification_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skillsRelations = relations(skills, ({ one }) => ({
  homemaker: one(users, {
    fields: [skills.homemakerId],
    references: [users.id],
  }),
}));

// Listings Model for services or products
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  homemakerId: integer("homemaker_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  type: text("type", { enum: ["service", "product"] }).notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  tags: text("tags").array(),
  images: text("images").array(),
  isFeatured: boolean("is_featured").default(false),
  location: text("location"),
  status: text("status", { enum: ["active", "inactive", "pending"] }).default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const listingsRelations = relations(listings, ({ one, many }) => ({
  homemaker: one(users, {
    fields: [listings.homemakerId],
    references: [users.id],
  }),
  orders: many(orders),
  reviews: many(reviews),
}));

// Reviews Model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  recipientId: integer("recipient_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  listing: one(listings, {
    fields: [reviews.listingId],
    references: [listings.id],
  }),
  author: one(users, {
    fields: [reviews.authorId],
    references: [users.id],
    relationName: "reviewAuthor",
  }),
  recipient: one(users, {
    fields: [reviews.recipientId],
    references: [users.id],
    relationName: "reviewRecipient",
  }),
}));

// Orders Model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  homemakerId: integer("homemaker_id").notNull().references(() => users.id),
  status: text("status", { enum: ["pending", "paid", "completed", "canceled"] }).default("pending"),
  quantity: integer("quantity").default(1).notNull(),
  totalAmount: integer("total_amount").notNull(), // in cents
  paymentId: text("payment_id"),
  deliveryDate: timestamp("delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  listing: one(listings, {
    fields: [orders.listingId],
    references: [listings.id],
  }),
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
    relationName: "customer",
  }),
  homemaker: one(users, {
    fields: [orders.homemakerId],
    references: [users.id],
    relationName: "homemaker",
  }),
}));

// Media model for skill verification
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type", { enum: ["image", "video", "audio"] }).notNull(),
  url: text("url").notNull(),
  purpose: text("purpose", { enum: ["skill_verification", "listing", "profile"] }).notNull(),
  skillId: integer("skill_id").references(() => skills.id),
  listingId: integer("listing_id").references(() => listings.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(users, {
    fields: [media.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [media.skillId],
    references: [skills.id],
    relationName: "skillMedia",
  }),
  listing: one(listings, {
    fields: [media.listingId],
    references: [listings.id],
    relationName: "listingMedia",
  }),
}));

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  verificationDate: true,
  verificationDetails: true,
  createdAt: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
