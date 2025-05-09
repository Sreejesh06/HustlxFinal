import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  profileCompletionPercentage: integer("profile_completion_percentage").default(0),
  isVerified: boolean("is_verified").default(false),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  profileCompletionPercentage: true,
  isVerified: true,
});

// Skills model
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  confidenceLevel: integer("confidence_level").default(0),
  isAiSuggested: boolean("is_ai_suggested").default(false),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

// Marketplace listings
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  image: text("image"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
});

// Mentors
export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio").notNull(),
  image: text("image"),
  rating: integer("rating"),
  menteeCount: integer("mentee_count").default(0),
  sessionPrice: integer("session_price"),
});

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
});

// Success Stories
export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  businessType: text("business_type").notNull(),
  tags: text("tags").array(),
});

export const insertSuccessStorySchema = createInsertSchema(successStories).omit({
  id: true,
});

// AI Skill Suggestions
export const skillSuggestions = pgTable("skill_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  matchPercentage: integer("match_percentage").notNull(),
  tags: text("tags").array(),
  icon: text("icon"),
});

export const insertSkillSuggestionSchema = createInsertSchema(skillSuggestions).omit({
  id: true,
});

// Assessment Responses
export const assessmentResponses = pgTable("assessment_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  responses: json("responses").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;

export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentor = typeof mentors.$inferSelect;

export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type SuccessStory = typeof successStories.$inferSelect;

export type InsertSkillSuggestion = z.infer<typeof insertSkillSuggestionSchema>;
export type SkillSuggestion = typeof skillSuggestions.$inferSelect;

export type InsertAssessmentResponse = z.infer<typeof insertAssessmentResponseSchema>;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
