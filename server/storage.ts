import { type Lead, type InsertLead, leads, type Podcast, type InsertPodcast, podcasts } from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsByType(leadType: string): Promise<Lead[]>;
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;
  getAllPodcasts(): Promise<Podcast[]>;
  getPodcastById(id: string): Promise<Podcast | undefined>;
  deletePodcast(id: string): Promise<boolean>;
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

  async createPodcast(insertPodcast: InsertPodcast): Promise<Podcast> {
    const [podcast] = await db.insert(podcasts).values(insertPodcast).returning();
    return podcast;
  }

  async getAllPodcasts(): Promise<Podcast[]> {
    return await db.select().from(podcasts).orderBy(desc(podcasts.publishedAt));
  }

  async getPodcastById(id: string): Promise<Podcast | undefined> {
    const [podcast] = await db.select().from(podcasts).where(eq(podcasts.id, id));
    return podcast;
  }

  async deletePodcast(id: string): Promise<boolean> {
    const result = await db.delete(podcasts).where(eq(podcasts.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DbStorage();
