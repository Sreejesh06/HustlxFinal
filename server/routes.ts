import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertSkillSchema, insertListingSchema, insertReviewSchema, insertOrderSchema, insertMediaSchema } from "@shared/schema";
import { verifyToken, requireAuth, requireRole } from "./middlewares/auth";
import { uploadMiddleware } from "./middlewares/upload";
import { groqClient } from "./services/groq";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

// JWT Secret (should be in env vars in production)
const JWT_SECRET = process.env.JWT_SECRET || "empowerher-jwt-secret";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Apply the auth middleware to all routes
  app.use(verifyToken);
  
  // Auth Routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingByEmail = await storage.getUserByEmail(userData.email);
      if (existingByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const existingByUsername = await storage.getUserByUsername(userData.username);
      if (existingByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      // Return user without password and token
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error during registration" });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      // Return user without password and token
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      res.status(500).json({ message: "Server error during login" });
    }
  });
  
  // User Routes
  app.get("/api/users/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return public user info without password
      const { password, email, phone, ...publicUserInfo } = user;
      res.json(publicUserInfo);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/users/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Don't allow role or password changes through this endpoint
      const { role, password, ...updateData } = req.body;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Skill Routes
  app.get("/api/skills/:id", async (req: Request, res: Response) => {
    try {
      const skillId = parseInt(req.params.id);
      if (isNaN(skillId)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const skill = await storage.getSkill(skillId);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.json(skill);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/homemakers/:id/skills", async (req: Request, res: Response) => {
    try {
      const homemakerId = parseInt(req.params.id);
      if (isNaN(homemakerId)) {
        return res.status(400).json({ message: "Invalid homemaker ID" });
      }
      
      const skills = await storage.getSkillsByHomemaker(homemakerId);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/skills", requireAuth, requireRole("homemaker"), async (req: Request, res: Response) => {
    try {
      const homemakerId = req.user?.userId;
      if (!homemakerId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const skillData = insertSkillSchema.parse({
        ...req.body,
        homemakerId
      });
      
      const skill = await storage.createSkill(skillData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Listing Routes
  app.get("/api/listings", async (req: Request, res: Response) => {
    try {
      const { query, category, type, minPrice, maxPrice, tags } = req.query;
      
      let results;
      if (query) {
        // Process tags if they exist
        const tagArray = tags ? (Array.isArray(tags) ? tags : [tags]) as string[] : undefined;
        
        results = await storage.searchListings(query as string, {
          category: category as string,
          type: type as "service" | "product",
          minPrice: minPrice ? parseInt(minPrice as string) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
          tags: tagArray
        });
      } else if (category) {
        results = await storage.getListingsByCategory(category as string);
      } else {
        // Default: get featured listings
        results = await storage.getFeaturedListings();
      }
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/listings/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const featuredListings = await storage.getFeaturedListings(limit);
      res.json(featuredListings);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/listings/:id", async (req: Request, res: Response) => {
    try {
      const listingId = parseInt(req.params.id);
      if (isNaN(listingId)) {
        return res.status(400).json({ message: "Invalid listing ID" });
      }
      
      const listing = await storage.getListing(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/homemakers/:id/listings", async (req: Request, res: Response) => {
    try {
      const homemakerId = parseInt(req.params.id);
      if (isNaN(homemakerId)) {
        return res.status(400).json({ message: "Invalid homemaker ID" });
      }
      
      const listings = await storage.getListingsByHomemaker(homemakerId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/listings", requireAuth, requireRole("homemaker"), async (req: Request, res: Response) => {
    try {
      const homemakerId = req.user?.userId;
      if (!homemakerId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const listingData = insertListingSchema.parse({
        ...req.body,
        homemakerId
      });
      
      const listing = await storage.createListing(listingData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/listings/:id", requireAuth, requireRole("homemaker"), async (req: Request, res: Response) => {
    try {
      const homemakerId = req.user?.userId;
      const listingId = parseInt(req.params.id);
      
      if (isNaN(listingId)) {
        return res.status(400).json({ message: "Invalid listing ID" });
      }
      
      // Check if listing belongs to the homemaker
      const listing = await storage.getListing(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.homemakerId !== homemakerId) {
        return res.status(403).json({ message: "You don't have permission to update this listing" });
      }
      
      // Don't allow changing the homemaker ID
      const { homemakerId: _, ...updateData } = req.body;
      
      const updatedListing = await storage.updateListing(listingId, updateData);
      res.json(updatedListing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/listings/:id", requireAuth, requireRole("homemaker"), async (req: Request, res: Response) => {
    try {
      const homemakerId = req.user?.userId;
      const listingId = parseInt(req.params.id);
      
      if (isNaN(listingId)) {
        return res.status(400).json({ message: "Invalid listing ID" });
      }
      
      // Check if listing belongs to the homemaker
      const listing = await storage.getListing(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.homemakerId !== homemakerId) {
        return res.status(403).json({ message: "You don't have permission to delete this listing" });
      }
      
      const deleted = await storage.deleteListing(listingId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Listing not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Review Routes
  app.get("/api/reviews/listing/:id", async (req: Request, res: Response) => {
    try {
      const listingId = parseInt(req.params.id);
      if (isNaN(listingId)) {
        return res.status(400).json({ message: "Invalid listing ID" });
      }
      
      const reviews = await storage.getReviewsByListing(listingId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/reviews/author/:id", async (req: Request, res: Response) => {
    try {
      const authorId = parseInt(req.params.id);
      if (isNaN(authorId)) {
        return res.status(400).json({ message: "Invalid author ID" });
      }
      
      const reviews = await storage.getReviewsByAuthor(authorId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/reviews/recipient/:id", async (req: Request, res: Response) => {
    try {
      const recipientId = parseInt(req.params.id);
      if (isNaN(recipientId)) {
        return res.status(400).json({ message: "Invalid recipient ID" });
      }
      
      const reviews = await storage.getReviewsByRecipient(recipientId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/reviews", requireAuth, requireRole("customer"), async (req: Request, res: Response) => {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Validate the listing exists and get the homemaker ID
      const listingId = req.body.listingId;
      const listing = await storage.getListing(listingId);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        authorId,
        recipientId: listing.homemakerId
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Order Routes
  app.get("/api/orders/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      let orders;
      if (userRole === "customer") {
        orders = await storage.getOrdersByCustomer(userId);
      } else if (userRole === "homemaker") {
        orders = await storage.getOrdersByHomemaker(userId);
      } else {
        return res.status(403).json({ message: "Invalid user role" });
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const orderId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Ensure user has permission to view this order
      if (userRole === "customer" && order.customerId !== userId) {
        return res.status(403).json({ message: "You don't have permission to view this order" });
      }
      
      if (userRole === "homemaker" && order.homemakerId !== userId) {
        return res.status(403).json({ message: "You don't have permission to view this order" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/orders", requireAuth, requireRole("customer"), async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.userId;
      if (!customerId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Validate the listing exists and get the homemaker ID
      const listingId = req.body.listingId;
      const listing = await storage.getListing(listingId);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      const quantity = req.body.quantity || 1;
      const totalAmount = listing.price * quantity;
      
      const orderData = insertOrderSchema.parse({
        ...req.body,
        customerId,
        homemakerId: listing.homemakerId,
        totalAmount
      });
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/orders/:id/status", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Permission rules:
      // - Homemakers can mark orders as completed
      // - Customers can mark orders as canceled
      // - Payment status changes (pending to paid) would be handled by payment processor webhook
      
      if (userRole === "homemaker" && order.homemakerId !== userId) {
        return res.status(403).json({ message: "You don't have permission to update this order" });
      }
      
      if (userRole === "customer" && order.customerId !== userId) {
        return res.status(403).json({ message: "You don't have permission to update this order" });
      }
      
      if (userRole === "homemaker" && status !== "completed") {
        return res.status(403).json({ message: "Homemakers can only mark orders as completed" });
      }
      
      if (userRole === "customer" && status !== "canceled") {
        return res.status(403).json({ message: "Customers can only cancel orders" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Media Upload & GROQ AI Routes
  app.post("/api/upload", requireAuth, uploadMiddleware.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Get uploaded file info
      const { filename, mimetype, size, path: filePath } = req.file;
      
      // Determine file type
      let fileType: "image" | "video" | "audio";
      if (mimetype.startsWith("image/")) {
        fileType = "image";
      } else if (mimetype.startsWith("video/")) {
        fileType = "video";
      } else if (mimetype.startsWith("audio/")) {
        fileType = "audio";
      } else {
        // Remove the file if not a valid type
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: "Invalid file type" });
      }
      
      // Get additional parameters
      const purpose = req.body.purpose as "skill_verification" | "listing" | "profile";
      const skillId = req.body.skillId ? parseInt(req.body.skillId) : undefined;
      const listingId = req.body.listingId ? parseInt(req.body.listingId) : undefined;
      
      // Create media record
      const mediaData = insertMediaSchema.parse({
        userId,
        type: fileType,
        url: `/uploads/${filename}`, // This would be a cloud URL in production
        purpose,
        skillId,
        listingId
      });
      
      const media = await storage.createMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/skills/verify", requireAuth, requireRole("homemaker"), async (req: Request, res: Response) => {
    try {
      const homemakerId = req.user?.userId;
      if (!homemakerId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { skillId, answers } = req.body;
      if (!skillId || !answers) {
        return res.status(400).json({ message: "Skill ID and answers are required" });
      }
      
      // Get the skill to verify it belongs to this homemaker
      const skill = await storage.getSkill(skillId);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      if (skill.homemakerId !== homemakerId) {
        return res.status(403).json({ message: "You don't have permission to verify this skill" });
      }
      
      // Get media associated with this skill
      const mediaItems = await storage.getMediaBySkill(skillId);
      
      // Prepare the Groq AI request
      const userInput = `
        Skill Category: ${skill.category}
        Skill Name: ${skill.name}
        Media Uploaded: ${mediaItems.length} files
        User Assessment Answers:
        ${JSON.stringify(answers, null, 2)}
      `;
      
      // For demo purposes, simulate different verification results
      let verificationResult;
      let level;
      
      // In a real implementation, this would call the Groq API
      const aiResult = await groqClient.verifySkill(userInput, skill);
      
      // Update the skill with verification results
      const verificationDetails = {
        verifiedAt: new Date().toISOString(),
        skillLevel: aiResult.level,
        feedback: aiResult.feedback,
        score: aiResult.score
      };
      
      const updatedSkill = await storage.updateSkill(skillId, {
        isVerified: true,
        level: aiResult.level,
        verificationDate: new Date(),
        verificationDetails
      });
      
      res.json({
        skill: updatedSkill,
        verificationDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Server error during skill verification" });
    }
  });
  
  app.get("/api/media/user/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const purpose = req.query.purpose as "skill_verification" | "listing" | "profile" | undefined;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const mediaItems = await storage.getMediaByUser(userId, purpose);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/media/skill/:id", async (req: Request, res: Response) => {
    try {
      const skillId = parseInt(req.params.id);
      
      if (isNaN(skillId)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const mediaItems = await storage.getMediaBySkill(skillId);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/media/listing/:id", async (req: Request, res: Response) => {
    try {
      const listingId = parseInt(req.params.id);
      
      if (isNaN(listingId)) {
        return res.status(400).json({ message: "Invalid listing ID" });
      }
      
      const mediaItems = await storage.getMediaByListing(listingId);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  return httpServer;
}
