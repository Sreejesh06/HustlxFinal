import { users, type User, type InsertUser } from "@shared/schema";
import { skills, type Skill, type InsertSkill } from "@shared/schema";
import { listings, type Listing, type InsertListing } from "@shared/schema";
import { mentors, type Mentor, type InsertMentor } from "@shared/schema";
import { successStories, type SuccessStory, type InsertSuccessStory } from "@shared/schema";
import { skillSuggestions, type SkillSuggestion, type InsertSkillSuggestion } from "@shared/schema";
import { assessmentResponses, type AssessmentResponse, type InsertAssessmentResponse } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Skills operations
  getUserSkills(userId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skillData: Partial<Skill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Listing operations
  getUserListings(userId: number): Promise<Listing[]>;
  getAllListings(): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: number, listingData: Partial<Listing>): Promise<Listing | undefined>;
  deleteListing(id: number): Promise<boolean>;
  
  // Mentor operations
  getAllMentors(): Promise<Mentor[]>;
  getMentor(id: number): Promise<Mentor | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  
  // Success Stories operations
  getAllSuccessStories(): Promise<SuccessStory[]>;
  getSuccessStory(id: number): Promise<SuccessStory | undefined>;
  createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory>;
  
  // Skill Suggestions operations
  getUserSkillSuggestions(userId: number): Promise<SkillSuggestion[]>;
  createSkillSuggestion(suggestion: InsertSkillSuggestion): Promise<SkillSuggestion>;
  deleteSkillSuggestion(id: number): Promise<boolean>;
  
  // Assessment operations
  getUserAssessment(userId: number): Promise<AssessmentResponse | undefined>;
  createAssessmentResponse(assessment: InsertAssessmentResponse): Promise<AssessmentResponse>;
  updateAssessmentResponse(id: number, data: Partial<AssessmentResponse>): Promise<AssessmentResponse | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        profileCompletionPercentage: 20,
        isVerified: false
      })
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getUserSkills(userId: number): Promise<Skill[]> {
    return db.select().from(skills).where(eq(skills.userId, userId));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db
      .insert(skills)
      .values(skill)
      .returning();
    return newSkill;
  }

  async updateSkill(id: number, skillData: Partial<Skill>): Promise<Skill | undefined> {
    const [skill] = await db
      .update(skills)
      .set(skillData)
      .where(eq(skills.id, id))
      .returning();
    return skill || undefined;
  }

  async deleteSkill(id: number): Promise<boolean> {
    const result = await db
      .delete(skills)
      .where(eq(skills.id, id));
    return !!result;
  }

  async getUserListings(userId: number): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.userId, userId));
  }

  async getAllListings(): Promise<Listing[]> {
    return db.select().from(listings);
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing || undefined;
  }

  async createListing(listing: InsertListing): Promise<Listing> {
    const [newListing] = await db
      .insert(listings)
      .values({
        ...listing,
        createdAt: new Date()
      })
      .returning();
    return newListing;
  }

  async updateListing(id: number, listingData: Partial<Listing>): Promise<Listing | undefined> {
    const [listing] = await db
      .update(listings)
      .set(listingData)
      .where(eq(listings.id, id))
      .returning();
    return listing || undefined;
  }

  async deleteListing(id: number): Promise<boolean> {
    const result = await db
      .delete(listings)
      .where(eq(listings.id, id));
    return !!result;
  }

  async getAllMentors(): Promise<Mentor[]> {
    return db.select().from(mentors);
  }

  async getMentor(id: number): Promise<Mentor | undefined> {
    const [mentor] = await db.select().from(mentors).where(eq(mentors.id, id));
    return mentor || undefined;
  }

  async createMentor(mentor: InsertMentor): Promise<Mentor> {
    const [newMentor] = await db
      .insert(mentors)
      .values(mentor)
      .returning();
    return newMentor;
  }

  async getAllSuccessStories(): Promise<SuccessStory[]> {
    return db.select().from(successStories);
  }

  async getSuccessStory(id: number): Promise<SuccessStory | undefined> {
    const [story] = await db.select().from(successStories).where(eq(successStories.id, id));
    return story || undefined;
  }

  async createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory> {
    const [newStory] = await db
      .insert(successStories)
      .values(story)
      .returning();
    return newStory;
  }

  async getUserSkillSuggestions(userId: number): Promise<SkillSuggestion[]> {
    return db.select().from(skillSuggestions).where(eq(skillSuggestions.userId, userId));
  }

  async createSkillSuggestion(suggestion: InsertSkillSuggestion): Promise<SkillSuggestion> {
    const [newSuggestion] = await db
      .insert(skillSuggestions)
      .values(suggestion)
      .returning();
    return newSuggestion;
  }

  async deleteSkillSuggestion(id: number): Promise<boolean> {
    const result = await db
      .delete(skillSuggestions)
      .where(eq(skillSuggestions.id, id));
    return !!result;
  }

  async getUserAssessment(userId: number): Promise<AssessmentResponse | undefined> {
    const [assessment] = await db
      .select()
      .from(assessmentResponses)
      .where(eq(assessmentResponses.userId, userId));
    return assessment || undefined;
  }

  async createAssessmentResponse(assessment: InsertAssessmentResponse): Promise<AssessmentResponse> {
    const [newAssessment] = await db
      .insert(assessmentResponses)
      .values({
        ...assessment,
        createdAt: new Date()
      })
      .returning();
    return newAssessment;
  }

  async updateAssessmentResponse(id: number, data: Partial<AssessmentResponse>): Promise<AssessmentResponse | undefined> {
    const [assessment] = await db
      .update(assessmentResponses)
      .set(data)
      .where(eq(assessmentResponses.id, id))
      .returning();
    return assessment || undefined;
  }
}

export const storage = new DatabaseStorage();