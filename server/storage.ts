import { type Lead, type InsertLead, leads } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsByType(leadType: string): Promise<Lead[]>;
}

export class DbStorage implements IStorage {
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(leads.createdAt);
  }

  async getLeadsByType(leadType: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.leadType, leadType)).orderBy(leads.createdAt);
  }
}

export const storage = new DbStorage();
