import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchParamsSchema, insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";

  // Get all owners for filter dropdown
  app.get(`${apiPrefix}/owners`, async (_req, res) => {
    try {
      const owners = await storage.getAllOwners();
      res.json(owners);
    } catch (error) {
      console.error("Error fetching owners:", error);
      res.status(500).json({ message: "Failed to fetch owners" });
    }
  });

  // Get all law firms for filter dropdown
  app.get(`${apiPrefix}/law-firms`, async (_req, res) => {
    try {
      const lawFirms = await storage.getAllLawFirms();
      res.json(lawFirms);
    } catch (error) {
      console.error("Error fetching law firms:", error);
      res.status(500).json({ message: "Failed to fetch law firms" });
    }
  });

  // Get all attorneys for filter dropdown
  app.get(`${apiPrefix}/attorneys`, async (_req, res) => {
    try {
      const attorneys = await storage.getAllAttorneys();
      res.json(attorneys);
    } catch (error) {
      console.error("Error fetching attorneys:", error);
      res.status(500).json({ message: "Failed to fetch attorneys" });
    }
  });

  // Search trademarks with filters
  app.get(`${apiPrefix}/search`, async (req, res) => {
    try {
      // Parse and validate search params
      const params = searchParamsSchema.parse({
        query: req.query.query || "",
        ownerFilter: req.query.ownerFilter || "",
        lawFirmFilter: req.query.lawFirmFilter || "",
        attorneyFilter: req.query.attorneyFilter || "",
        statusFilter: req.query.statusFilter || "",
        filingDateFrom: req.query.filingDateFrom || "",
        filingDateTo: req.query.filingDateTo || "",
        registrationNumber: req.query.registrationNumber || "",
        sortBy: req.query.sortBy || "relevance",
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        perPage: req.query.perPage ? parseInt(req.query.perPage as string) : 10
      });

      // Perform search
      const results = await storage.searchTrademarks(params);
      res.json(results);
    } catch (error) {
      console.error("Error searching trademarks:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to search trademarks" });
      }
    }
  });

  // Get trademark details
  app.get(`${apiPrefix}/trademarks/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid trademark ID" });
      }

      const trademark = await storage.getTrademarkById(id);
      if (!trademark) {
        return res.status(404).json({ message: "Trademark not found" });
      }

      res.json(trademark);
    } catch (error) {
      console.error("Error fetching trademark:", error);
      res.status(500).json({ message: "Failed to fetch trademark details" });
    }
  });

  // Join waitlist
  app.post(`${apiPrefix}/waitlist`, async (req, res) => {
    try {
      const waitlistData = insertWaitlistSchema.parse(req.body);
      const result = await storage.addToWaitlist(waitlistData);
      res.json({ message: "Successfully added to waitlist", id: result.id });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else if (error.code === '23505') { // PostgreSQL unique constraint violation
        res.status(409).json({ message: "This email is already on the waitlist" });
      } else {
        res.status(500).json({ message: "Failed to add to waitlist" });
      }
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
