import { type Lead, type InsertLead, leads, type Podcast, type InsertPodcast, podcasts, type Member, type Invitation, members, invitations, brands, type Brand, type InsertBrand } from "@shared/schema";
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
  createInvitation(email: string, name: string): Promise<Invitation>;
  getAllInvitations(): Promise<Invitation[]>;
  getInvitationByCode(code: string): Promise<Invitation | undefined>;
  deleteInvitation(id: string): Promise<boolean>;
  redeemInvitation(code: string, email: string, name: string, brandData?: Array<{ name: string; website: string }>): Promise<Member>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getMemberById(id: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  updateMember(id: string, name: string): Promise<Member | undefined>;
  updateMemberProgress(email: string, phase: number, complete: boolean): Promise<void>;
  getBrandsByMemberId(memberId: string): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: string): Promise<boolean>;
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

  async createInvitation(email: string, name: string): Promise<Invitation> {
    const code = Math.random().toString(36).substring(2, 15).toUpperCase();
    
    // Check if member already exists
    const existingMember = await db.select().from(members).where(eq(members.email, email));
    
    // Create member if doesn't exist
    if (!existingMember.length) {
      await db.insert(members).values({
        email,
        name,
      });
    }
    
    const [invitation] = await db.insert(invitations).values({
      email,
      invitationCode: code,
    }).returning();
    return invitation;
  }

  async getAllInvitations(): Promise<Invitation[]> {
    return await db.select().from(invitations).orderBy(desc(invitations.createdAt));
  }

  async getInvitationByCode(code: string): Promise<Invitation | undefined> {
    const [invitation] = await db.select().from(invitations).where(eq(invitations.invitationCode, code));
    return invitation;
  }

  async deleteInvitation(id: string): Promise<boolean> {
    const result = await db.delete(invitations).where(eq(invitations.id, id));
    return result.rowCount > 0;
  }

  async redeemInvitation(code: string, email: string, name: string, brandData?: Array<{ name: string; website: string; devPersonName?: string; devPersonEmail?: string; devPersonPhone?: string }>): Promise<Member> {
    const [member] = await db.insert(members).values({
      email,
      name,
    }).returning();
    
    if (brandData && brandData.length > 0) {
      for (const brand of brandData) {
        await db.insert(brands).values({
          memberId: member.id,
          name: brand.name,
          website: brand.website,
          devPersonName: brand.devPersonName,
          devPersonEmail: brand.devPersonEmail,
          devPersonPhone: brand.devPersonPhone,
        });
      }
    }
    
    await db.update(invitations).set({
      isUsed: true,
      usedAt: new Date(),
    }).where(eq(invitations.invitationCode, code));
    
    return member;
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.email, email));
    return member;
  }

  async updateMemberProgress(email: string, phase: number, complete: boolean): Promise<void> {
    if (phase === 1) {
      await db.update(members).set({ phase1Complete: complete }).where(eq(members.email, email));
    } else if (phase === 2) {
      await db.update(members).set({ phase2Complete: complete }).where(eq(members.email, email));
    } else if (phase === 3) {
      await db.update(members).set({ phase3Complete: complete }).where(eq(members.email, email));
    } else if (phase === 4) {
      await db.update(members).set({ phase4Complete: complete }).where(eq(members.email, email));
    }
  }

  async getBrandsByMemberId(memberId: string): Promise<Brand[]> {
    return await db.select().from(brands).where(eq(brands.memberId, memberId)).orderBy(brands.createdAt);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [newBrand] = await db.insert(brands).values(brand).returning();
    return newBrand;
  }

  async getMemberById(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async getAllMembers(): Promise<Member[]> {
    return await db.select().from(members).orderBy(desc(members.createdAt));
  }

  async updateMember(id: string, name: string): Promise<Member | undefined> {
    const [member] = await db.update(members).set({ name }).where(eq(members.id, id)).returning();
    return member;
  }

  async updateBrand(id: string, brandData: Partial<InsertBrand>): Promise<Brand | undefined> {
    const [brand] = await db.update(brands).set(brandData).where(eq(brands.id, id)).returning();
    return brand;
  }

  async deleteBrand(id: string): Promise<boolean> {
    const result = await db.delete(brands).where(eq(brands.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DbStorage();
