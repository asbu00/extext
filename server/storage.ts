import { type User, type InsertUser, type BlockingPeriod, type InsertBlockingPeriod } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blocking periods CRUD
  getBlockingPeriods(userId: string): Promise<BlockingPeriod[]>;
  createBlockingPeriod(period: InsertBlockingPeriod): Promise<BlockingPeriod>;
  updateBlockingPeriod(id: number, period: Partial<InsertBlockingPeriod>): Promise<BlockingPeriod | undefined>;
  deleteBlockingPeriod(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private blockingPeriods: Map<number, BlockingPeriod>;
  private nextBlockingPeriodId: number;

  constructor() {
    this.users = new Map();
    this.blockingPeriods = new Map();
    this.nextBlockingPeriodId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBlockingPeriods(userId: string): Promise<BlockingPeriod[]> {
    return Array.from(this.blockingPeriods.values()).filter(
      (period) => period.userId === userId
    );
  }

  async createBlockingPeriod(insertPeriod: InsertBlockingPeriod): Promise<BlockingPeriod> {
    const id = this.nextBlockingPeriodId++;
    const period: BlockingPeriod = {
      id,
      name: insertPeriod.name,
      userId: insertPeriod.userId || null,
      startTime: insertPeriod.startTime,
      endTime: insertPeriod.endTime,
      daysOfWeek: insertPeriod.daysOfWeek,
      isActive: insertPeriod.isActive ?? true,
      createdAt: new Date(),
    };
    this.blockingPeriods.set(id, period);
    return period;
  }

  async updateBlockingPeriod(id: number, updatePeriod: Partial<InsertBlockingPeriod>): Promise<BlockingPeriod | undefined> {
    const existing = this.blockingPeriods.get(id);
    if (!existing) return undefined;
    
    const updated: BlockingPeriod = { ...existing, ...updatePeriod };
    this.blockingPeriods.set(id, updated);
    return updated;
  }

  async deleteBlockingPeriod(id: number): Promise<boolean> {
    return this.blockingPeriods.delete(id);
  }
}

export const storage = new MemStorage();
