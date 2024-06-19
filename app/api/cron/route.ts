// pages/api/cron.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const allUsers = await db.select().from(users).execute();

    for (const user of allUsers) {
      await db.update(users)
        .set({ balance: user.balance + 10 })
        .where(users.id.eq(user.id))
        .execute();
    }

    res.status(200).json({ message: 'Balances updated successfully' });
  } catch (error) {
    console.error('Error updating balances:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
