import { db } from './db/index.ts';
import { members } from './shared/schema.ts';

async function createTestMember() {
  try {
    const [member] = await db.insert(members).values({
      email: 'test@franchisefriend.com',
      name: 'Test Member',
    }).returning();
    console.log('Created test member:', member);
  } catch (err) {
    console.error('Error creating member:', err);
  }
}

createTestMember();
