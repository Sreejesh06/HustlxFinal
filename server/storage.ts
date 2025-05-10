import { 
  users, type User, type InsertUser,
  skills, type Skill, type InsertSkill,
  listings, type Listing, type InsertListing,
  reviews, type Review, type InsertReview,
  orders, type Order, type InsertOrder,
  media, type Media, type InsertMedia
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, or, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Skill operations
  getSkill(id: number): Promise<Skill | undefined>;
  getSkillsByHomemaker(homemakerId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skillData: Partial<Skill>): Promise<Skill | undefined>;
  
  // Listing operations
  getListing(id: number): Promise<Listing | undefined>;
  getListingsByHomemaker(homemakerId: number): Promise<Listing[]>;
  getListingsByCategory(category: string): Promise<Listing[]>;
  searchListings(query: string, filters?: { 
    category?: string, 
    type?: "service" | "product",
    minPrice?: number,
    maxPrice?: number,
    tags?: string[]
  }): Promise<Listing[]>;
  getFeaturedListings(limit?: number): Promise<Listing[]>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: number, listingData: Partial<Listing>): Promise<Listing | undefined>;
  deleteListing(id: number): Promise<boolean>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByListing(listingId: number): Promise<Review[]>;
  getReviewsByAuthor(authorId: number): Promise<Review[]>;
  getReviewsByRecipient(recipientId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: number): Promise<Order[]>;
  getOrdersByHomemaker(homemakerId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: Order['status']): Promise<Order | undefined>;
  
  // Media operations
  getMedia(id: number): Promise<Media | undefined>;
  getMediaByUser(userId: number, purpose?: Media['purpose']): Promise<Media[]>;
  getMediaBySkill(skillId: number): Promise<Media[]>;
  getMediaByListing(listingId: number): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Skill operations
  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }
  
  async getSkillsByHomemaker(homemakerId: number): Promise<Skill[]> {
    return db.select().from(skills).where(eq(skills.homemakerId, homemakerId));
  }
  
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db
      .insert(skills)
      .values(skill)
      .returning();
    return newSkill;
  }
  
  async updateSkill(id: number, skillData: Partial<Skill>): Promise<Skill | undefined> {
    const [updatedSkill] = await db
      .update(skills)
      .set(skillData)
      .where(eq(skills.id, id))
      .returning();
    return updatedSkill;
  }
  
  // Listing operations
  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }
  
  async getListingsByHomemaker(homemakerId: number): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.homemakerId, homemakerId));
  }
  
  async getListingsByCategory(category: string): Promise<Listing[]> {
    return db.select().from(listings).where(eq(listings.category, category));
  }
  
  async searchListings(query: string, filters?: { 
    category?: string, 
    type?: "service" | "product",
    minPrice?: number,
    maxPrice?: number,
    tags?: string[]
  }): Promise<Listing[]> {
    let query_condition = or(
      like(listings.title, `%${query}%`),
      like(listings.description, `%${query}%`)
    );
    
    // Start with an active status filter
    let conditions = and(
      eq(listings.status, "active"),
      query_condition
    );
    
    // Add optional filters
    if (filters) {
      if (filters.category) {
        conditions = and(conditions, eq(listings.category, filters.category));
      }
      
      if (filters.type) {
        conditions = and(conditions, eq(listings.type, filters.type));
      }
      
      if (filters.minPrice !== undefined) {
        conditions = and(conditions, listings.price >= filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        conditions = and(conditions, listings.price <= filters.maxPrice);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        // This is a simplification; in a real implementation, you'd need a more complex query
        // for array containment or use a separate tags table with a many-to-many relationship
        conditions = and(conditions, inArray(listings.tags, filters.tags));
      }
    }
    
    return db.select().from(listings).where(conditions);
  }
  
  async getFeaturedListings(limit = 6): Promise<Listing[]> {
    return db
      .select()
      .from(listings)
      .where(and(
        eq(listings.status, "active"),
        eq(listings.isFeatured, true)
      ))
      .limit(limit);
  }
  
  async createListing(listing: InsertListing): Promise<Listing> {
    const [newListing] = await db
      .insert(listings)
      .values(listing)
      .returning();
    return newListing;
  }
  
  async updateListing(id: number, listingData: Partial<Listing>): Promise<Listing | undefined> {
    const [updatedListing] = await db
      .update(listings)
      .set(listingData)
      .where(eq(listings.id, id))
      .returning();
    return updatedListing;
  }
  
  async deleteListing(id: number): Promise<boolean> {
    const result = await db
      .delete(listings)
      .where(eq(listings.id, id))
      .returning({ id: listings.id });
    return result.length > 0;
  }
  
  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }
  
  async getReviewsByListing(listingId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.listingId, listingId));
  }
  
  async getReviewsByAuthor(authorId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.authorId, authorId));
  }
  
  async getReviewsByRecipient(recipientId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.recipientId, recipientId));
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }
  
  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.customerId, customerId));
  }
  
  async getOrdersByHomemaker(homemakerId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.homemakerId, homemakerId));
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: Order['status']): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
  
  // Media operations
  async getMedia(id: number): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem;
  }
  
  async getMediaByUser(userId: number, purpose?: Media['purpose']): Promise<Media[]> {
    let condition = eq(media.userId, userId);
    if (purpose) {
      condition = and(condition, eq(media.purpose, purpose));
    }
    return db.select().from(media).where(condition);
  }
  
  async getMediaBySkill(skillId: number): Promise<Media[]> {
    return db.select().from(media).where(eq(media.skillId, skillId));
  }
  
  async getMediaByListing(listingId: number): Promise<Media[]> {
    return db.select().from(media).where(eq(media.listingId, listingId));
  }
  
  async createMedia(media: InsertMedia): Promise<Media> {
    const [newMedia] = await db
      .insert(media)
      .values(media)
      .returning();
    return newMedia;
  }
  
  async deleteMedia(id: number): Promise<boolean> {
    const result = await db
      .delete(media)
      .where(eq(media.id, id))
      .returning({ id: media.id });
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
