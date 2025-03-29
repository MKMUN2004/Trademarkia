import { 
  users, type User, type InsertUser,
  trademarks, type Trademark, type TrademarkWithRelations,
  owners, type Owner,
  attorneys, type Attorney,
  lawFirms, type LawFirm,
  waitlist, type Waitlist, type InsertWaitlist,
  type SearchParams, type SearchResults
} from "@shared/schema";

// Storage interface with all required CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Owner methods
  getAllOwners(): Promise<Owner[]>;
  
  // Law Firm methods
  getAllLawFirms(): Promise<LawFirm[]>;
  
  // Attorney methods
  getAllAttorneys(): Promise<Attorney[]>;
  
  // Trademark methods
  getTrademarkById(id: number): Promise<TrademarkWithRelations | undefined>;
  searchTrademarks(params: SearchParams): Promise<SearchResults>;
  
  // Waitlist methods
  addToWaitlist(data: InsertWaitlist): Promise<Waitlist>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trademarks: Map<number, Trademark>;
  private trademarkOwners: Map<number, Owner>;
  private trademarkAttorneys: Map<number, Attorney>;
  private trademarkLawFirms: Map<number, LawFirm>;
  private trademarkClassifications: Map<number, number[]>;
  private waitlistEntries: Map<number, Waitlist>;
  
  // IDs for different entities
  private userCurrentId: number;
  private trademarkCurrentId: number;
  private ownerCurrentId: number;
  private attorneyCurrentId: number;
  private lawFirmCurrentId: number;
  private waitlistCurrentId: number;

  constructor() {
    // Initialize storage maps
    this.users = new Map();
    this.trademarks = new Map();
    this.trademarkOwners = new Map();
    this.trademarkAttorneys = new Map();
    this.trademarkLawFirms = new Map();
    this.trademarkClassifications = new Map();
    this.waitlistEntries = new Map();
    
    // Initialize IDs
    this.userCurrentId = 1;
    this.trademarkCurrentId = 1;
    this.ownerCurrentId = 1;
    this.attorneyCurrentId = 1;
    this.lawFirmCurrentId = 1;
    this.waitlistCurrentId = 1;
    
    // Add sample data
    this.initializeSampleData();
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Create sample owners
    const nike = this.createOwner({ name: "Nike, Inc.", address: "One Bowerman Drive, Beaverton, OR 97005" });
    const apple = this.createOwner({ name: "Apple Inc.", address: "One Apple Park Way, Cupertino, CA 95014" });
    const microsoft = this.createOwner({ name: "Microsoft Corporation", address: "One Microsoft Way, Redmond, WA 98052" });
    
    // Create sample law firms
    const lawFirm1 = this.createLawFirm({ name: "Trademark Legal Partners LLP", address: "123 Law Street, New York, NY 10001" });
    const lawFirm2 = this.createLawFirm({ name: "Intellectual Property Associates", address: "456 IP Avenue, San Francisco, CA 94107" });
    
    // Create sample attorneys
    const attorney1 = this.createAttorney({ name: "John Smith", lawFirmId: lawFirm1.id });
    const attorney2 = this.createAttorney({ name: "Sarah Johnson", lawFirmId: lawFirm2.id });
    const attorney3 = this.createAttorney({ name: "Michael Davis", lawFirmId: lawFirm1.id });
    
    // Create sample trademarks
    this.createTrademark({
      name: "NIKE", 
      serialNumber: "76123456", 
      description: "The word mark NIKE and the Swoosh design logo for athletic footwear and apparel",
      filingDate: "2022-01-15",
      registrationDate: "2022-06-20",
      statusId: 1, // Registered
      ownerId: nike.id,
      attorneyId: attorney1.id,
      lawFirmId: lawFirm1.id,
      classifications: [25, 28] // Clothing, Sports equipment
    });
    
    this.createTrademark({
      name: "APPLE", 
      serialNumber: "86789012", 
      description: "The word mark APPLE and Apple logo for computers, software and related goods",
      filingDate: "2021-05-10",
      registrationDate: "2021-11-25",
      statusId: 1, // Registered
      ownerId: apple.id,
      attorneyId: attorney2.id,
      lawFirmId: lawFirm2.id,
      classifications: [9, 42] // Electronics, Software
    });
    
    this.createTrademark({
      name: "MICROSOFT", 
      serialNumber: "75345678", 
      description: "The word mark MICROSOFT for computer software and hardware",
      filingDate: "2020-09-30",
      registrationDate: null,
      statusId: 2, // Pending
      ownerId: microsoft.id,
      attorneyId: attorney3.id,
      lawFirmId: lawFirm1.id,
      classifications: [9, 42] // Electronics, Software
    });
    
    this.createTrademark({
      name: "AIR JORDAN", 
      serialNumber: "77654321", 
      description: "The word mark AIR JORDAN for athletic footwear",
      filingDate: "2019-08-12",
      registrationDate: "2020-03-05",
      statusId: 1, // Registered
      ownerId: nike.id,
      attorneyId: attorney1.id,
      lawFirmId: lawFirm1.id,
      classifications: [25] // Clothing
    });
  }
  
  // Helper methods to create entities
  private createOwner(data: { name: string, address: string }): Owner {
    const id = this.ownerCurrentId++;
    const owner: Owner = { id, ...data };
    this.trademarkOwners.set(id, owner);
    return owner;
  }
  
  private createLawFirm(data: { name: string, address: string }): LawFirm {
    const id = this.lawFirmCurrentId++;
    const lawFirm: LawFirm = { id, ...data };
    this.trademarkLawFirms.set(id, lawFirm);
    return lawFirm;
  }
  
  private createAttorney(data: { name: string, lawFirmId: number }): Attorney {
    const id = this.attorneyCurrentId++;
    const attorney: Attorney = { id, ...data };
    this.trademarkAttorneys.set(id, attorney);
    return attorney;
  }
  
  private createTrademark(data: {
    name: string,
    serialNumber: string,
    description: string,
    filingDate: string | null,
    registrationDate: string | null,
    statusId: number,
    ownerId: number,
    attorneyId: number | null,
    lawFirmId: number | null,
    classifications: number[]
  }): Trademark {
    const id = this.trademarkCurrentId++;
    const trademark: Trademark = { 
      id, 
      name: data.name,
      serialNumber: data.serialNumber,
      description: data.description,
      filingDate: data.filingDate,
      registrationDate: data.registrationDate,
      statusId: data.statusId,
      ownerId: data.ownerId,
      attorneyId: data.attorneyId,
      lawFirmId: data.lawFirmId,
      searchCount: 0
    };
    
    this.trademarks.set(id, trademark);
    this.trademarkClassifications.set(id, data.classifications);
    
    return trademark;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Owner methods
  async getAllOwners(): Promise<Owner[]> {
    return Array.from(this.trademarkOwners.values());
  }
  
  // Law Firm methods
  async getAllLawFirms(): Promise<LawFirm[]> {
    return Array.from(this.trademarkLawFirms.values());
  }
  
  // Attorney methods
  async getAllAttorneys(): Promise<Attorney[]> {
    return Array.from(this.trademarkAttorneys.values());
  }
  
  // Trademark methods
  async getTrademarkById(id: number): Promise<TrademarkWithRelations | undefined> {
    const trademark = this.trademarks.get(id);
    if (!trademark) {
      return undefined;
    }
    
    const owner = this.trademarkOwners.get(trademark.ownerId!);
    if (!owner) {
      return undefined;
    }
    
    // Get attorney if exists
    let attorney: Attorney | null = null;
    if (trademark.attorneyId) {
      const foundAttorney = this.trademarkAttorneys.get(trademark.attorneyId);
      if (foundAttorney) {
        attorney = foundAttorney;
      }
    }
    
    // Get law firm if exists
    let lawFirm: LawFirm | null = null;
    if (trademark.lawFirmId) {
      const foundLawFirm = this.trademarkLawFirms.get(trademark.lawFirmId);
      if (foundLawFirm) {
        lawFirm = foundLawFirm;
      }
    }
    
    const classifications = this.trademarkClassifications.get(id) || [];
    
    return {
      ...trademark,
      owner,
      attorney,
      lawFirm,
      classifications
    };
  }
  
  async searchTrademarks(params: SearchParams): Promise<SearchResults> {
    // Start with all trademarks
    let results = Array.from(this.trademarks.values());
    
    // Filter by query (trademark name)
    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(tm => tm.name.toLowerCase().includes(query));
    }
    
    // Filter by owner
    if (params.ownerFilter) {
      results = results.filter(tm => {
        if (!tm.ownerId) return false;
        const owner = this.trademarkOwners.get(tm.ownerId);
        return owner?.name.includes(params.ownerFilter!);
      });
    }
    
    // Filter by law firm
    if (params.lawFirmFilter) {
      results = results.filter(tm => {
        if (!tm.lawFirmId) return false;
        const lawFirm = this.trademarkLawFirms.get(tm.lawFirmId);
        return lawFirm?.name.includes(params.lawFirmFilter!);
      });
    }
    
    // Filter by attorney
    if (params.attorneyFilter) {
      results = results.filter(tm => {
        if (!tm.attorneyId) return false;
        const attorney = this.trademarkAttorneys.get(tm.attorneyId);
        return attorney?.name.includes(params.attorneyFilter!);
      });
    }
    
    // Filter by status
    if (params.statusFilter) {
      results = results.filter(tm => {
        const statusMap: Record<number, string> = {
          1: "Registered",
          2: "Pending",
          3: "Abandoned",
          4: "Cancelled",
          5: "Expired",
          6: "Opposition"
        };
        return statusMap[tm.statusId] === params.statusFilter;
      });
    }
    
    // Filter by filing date range
    if (params.filingDateFrom) {
      results = results.filter(tm => 
        tm.filingDate && new Date(tm.filingDate) >= new Date(params.filingDateFrom!)
      );
    }
    
    if (params.filingDateTo) {
      results = results.filter(tm => 
        tm.filingDate && new Date(tm.filingDate) <= new Date(params.filingDateTo!)
      );
    }
    
    // Filter by registration number
    if (params.registrationNumber) {
      results = results.filter(tm => 
        tm.serialNumber.includes(params.registrationNumber!)
      );
    }
    
    // Sort results
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'recent':
          results.sort((a, b) => {
            if (!a.filingDate) return 1;
            if (!b.filingDate) return -1;
            return new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime();
          });
          break;
        case 'oldest':
          results.sort((a, b) => {
            if (!a.filingDate) return 1;
            if (!b.filingDate) return -1;
            return new Date(a.filingDate).getTime() - new Date(b.filingDate).getTime();
          });
          break;
        case 'name-asc':
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          results.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          // relevance - already handled by the query filter
          break;
      }
    }
    
    // Calculate pagination
    const total = results.length;
    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedResults = results.slice(start, end);
    
    // Map to TrademarkWithRelations
    const trademarksWithRelations = await Promise.all(
      paginatedResults.map(async tm => this.getTrademarkById(tm.id) as Promise<TrademarkWithRelations>)
    );
    
    return {
      trademarks: trademarksWithRelations,
      total,
      page,
      perPage,
      query: params.query || ""
    };
  }
  
  // Waitlist methods
  async addToWaitlist(data: InsertWaitlist): Promise<Waitlist> {
    // Check if email already exists
    const exists = Array.from(this.waitlistEntries.values()).find(
      entry => entry.email === data.email
    );
    
    if (exists) {
      const error: any = new Error("Email already exists in waitlist");
      error.code = '23505'; // PostgreSQL unique constraint violation code
      throw error;
    }
    
    const id = this.waitlistCurrentId++;
    const waitlistEntry: Waitlist = { 
      ...data, 
      id, 
      createdAt: new Date().toISOString() 
    };
    
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }
}

export const storage = new MemStorage();
