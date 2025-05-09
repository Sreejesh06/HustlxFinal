import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertSkillSchema, 
  insertListingSchema, 
  insertAssessmentResponseSchema,
  skillSuggestions
} from "@shared/schema";
import { z } from "zod";
import { generateSkillSuggestions, analyzeAssessmentResponses, generateBusinessSuggestions, suggestMentors } from "./groqai";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcryptjs';

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Configure session
  const SessionStore = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'skillbloom-secret',
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  }));
  
  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
  };
  
  // Helper function to hash password
  const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };
  
  // AUTH ROUTES
  
  // Registration
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: 'Server error during registration' });
      }
    }
  });
  
  // Login
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  
  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error during logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  // Get current user
  app.get('/api/auth/user', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as any;
    
    res.json(userWithoutPassword);
  });
  
  // USER ROUTES
  
  // Update user profile
  app.patch('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user is updating their own profile
      if (req.user && (req.user as any).id !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this profile' });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Server error updating user' });
    }
  });
  
  // SKILLS ROUTES
  
  // Get user skills
  app.get('/api/users/:id/skills', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const skills = await storage.getUserSkills(userId);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching skills' });
    }
  });
  
  // Create new skill
  app.post('/api/skills', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      
      // Ensure user can only create skills for themselves
      if ((req.user as any).id !== validatedData.userId) {
        return res.status(403).json({ message: 'Not authorized to create skills for this user' });
      }
      
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: 'Server error creating skill' });
      }
    }
  });
  
  // Update skill
  app.patch('/api/skills/:id', isAuthenticated, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      const skill = await storage.updateSkill(skillId, req.body);
      
      if (!skill) {
        return res.status(404).json({ message: 'Skill not found' });
      }
      
      res.json(skill);
    } catch (error) {
      res.status(500).json({ message: 'Server error updating skill' });
    }
  });
  
  // Delete skill
  app.delete('/api/skills/:id', isAuthenticated, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      const deleted = await storage.deleteSkill(skillId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Skill not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Server error deleting skill' });
    }
  });
  
  // LISTING ROUTES
  
  // Get all listings
  app.get('/api/listings', async (req, res) => {
    try {
      const listings = await storage.getAllListings();
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching listings' });
    }
  });
  
  // Get user listings
  app.get('/api/users/:id/listings', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const listings = await storage.getUserListings(userId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching user listings' });
    }
  });
  
  // Get single listing
  app.get('/api/listings/:id', async (req, res) => {
    try {
      const listingId = parseInt(req.params.id);
      const listing = await storage.getListing(listingId);
      
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching listing' });
    }
  });
  
  // Create new listing
  app.post('/api/listings', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertListingSchema.parse(req.body);
      
      // Ensure user can only create listings for themselves
      if ((req.user as any).id !== validatedData.userId) {
        return res.status(403).json({ message: 'Not authorized to create listings for this user' });
      }
      
      const listing = await storage.createListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: 'Server error creating listing' });
      }
    }
  });
  
  // Update listing
  app.patch('/api/listings/:id', isAuthenticated, async (req, res) => {
    try {
      const listingId = parseInt(req.params.id);
      const listing = await storage.getListing(listingId);
      
      // Check if listing exists and belongs to user
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      
      if (listing.userId !== (req.user as any).id) {
        return res.status(403).json({ message: 'Not authorized to update this listing' });
      }
      
      const updatedListing = await storage.updateListing(listingId, req.body);
      res.json(updatedListing);
    } catch (error) {
      res.status(500).json({ message: 'Server error updating listing' });
    }
  });
  
  // Delete listing
  app.delete('/api/listings/:id', isAuthenticated, async (req, res) => {
    try {
      const listingId = parseInt(req.params.id);
      const listing = await storage.getListing(listingId);
      
      // Check if listing exists and belongs to user
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      
      if (listing.userId !== (req.user as any).id) {
        return res.status(403).json({ message: 'Not authorized to delete this listing' });
      }
      
      const deleted = await storage.deleteListing(listingId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Server error deleting listing' });
    }
  });
  
  // MENTOR ROUTES
  
  // Get all mentors
  app.get('/api/mentors', async (req, res) => {
    try {
      const mentors = await storage.getAllMentors();
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching mentors' });
    }
  });
  
  // Get single mentor
  app.get('/api/mentors/:id', async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      const mentor = await storage.getMentor(mentorId);
      
      if (!mentor) {
        return res.status(404).json({ message: 'Mentor not found' });
      }
      
      res.json(mentor);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching mentor' });
    }
  });
  
  // SUCCESS STORIES ROUTES
  
  // Get all success stories
  app.get('/api/success-stories', async (req, res) => {
    try {
      const stories = await storage.getAllSuccessStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching success stories' });
    }
  });
  
  // Get single success story
  app.get('/api/success-stories/:id', async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const story = await storage.getSuccessStory(storyId);
      
      if (!story) {
        return res.status(404).json({ message: 'Success story not found' });
      }
      
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching success story' });
    }
  });
  
  // AI ROUTES
  
  // Generate skill suggestions
  app.post('/api/ai/skill-suggestions', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { interests, experience, hobbies, personalityTraits, demographics } = req.body;
      
      // Call OpenAI to generate suggestions
      const suggestions = await generateSkillSuggestions({
        interests,
        experience,
        hobbies,
        personalityTraits,
        demographics
      });
      
      // Save suggestions to database
      const savedSuggestions = [];
      
      for (const skill of suggestions.skills) {
        const savedSuggestion = await storage.createSkillSuggestion({
          userId,
          name: skill.name,
          description: skill.description,
          matchPercentage: skill.matchPercentage,
          tags: skill.tags,
          icon: skill.icon
        });
        
        savedSuggestions.push(savedSuggestion);
      }
      
      res.json(savedSuggestions);
    } catch (error) {
      res.status(500).json({ message: 'Server error generating skill suggestions' });
    }
  });
  
  // Get user skill suggestions
  app.get('/api/users/:id/skill-suggestions', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const suggestions = await storage.getUserSkillSuggestions(userId);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching skill suggestions' });
    }
  });
  
  // Submit assessment and get analysis
  app.post('/api/assessments', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const validatedData = insertAssessmentResponseSchema.parse({
        userId,
        responses: req.body,
        completed: true
      });
      
      // Save assessment responses
      const savedAssessment = await storage.createAssessmentResponse(validatedData);
      
      // Analyze responses with OpenAI
      const analysis = await analyzeAssessmentResponses(req.body);
      
      // Save suggested skills to database
      const savedSuggestions = [];
      
      for (const skill of analysis.suggestedSkills) {
        const savedSuggestion = await storage.createSkillSuggestion({
          userId,
          name: skill.name,
          description: skill.description,
          matchPercentage: skill.matchPercentage,
          tags: skill.tags,
          icon: skill.icon
        });
        
        savedSuggestions.push(savedSuggestion);
      }
      
      res.json({
        assessment: savedAssessment,
        skillSuggestions: savedSuggestions,
        businessInsights: analysis.businessInsights
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: 'Server error processing assessment' });
      }
    }
  });
  
  // Generate business growth suggestions
  app.post('/api/ai/business-suggestions', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { skills, currentServices, averagePrice, salesData } = req.body;
      
      const suggestions = await generateBusinessSuggestions({
        skills,
        currentServices,
        averagePrice,
        salesData
      });
      
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: 'Server error generating business suggestions' });
    }
  });
  
  // Get mentor recommendations
  app.post('/api/ai/mentor-recommendations', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { skills, interests, goals } = req.body;
      
      // Get all available mentors
      const availableMentors = await storage.getAllMentors();
      
      // Get mentor recommendations from OpenAI
      const recommendations = await suggestMentors(
        { skills, interests, goals },
        availableMentors
      );
      
      // Combine recommendations with full mentor data
      const recommendedMentors = recommendations.mentors.map(rec => {
        const mentor = availableMentors.find(m => m.id === rec.id);
        return {
          ...mentor,
          matchPercentage: rec.matchPercentage,
          matchReason: rec.matchReason
        };
      });
      
      res.json(recommendedMentors);
    } catch (error) {
      res.status(500).json({ message: 'Server error generating mentor recommendations' });
    }
  });

  return httpServer;
}
