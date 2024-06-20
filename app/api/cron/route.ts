// pages/api/cron.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';



export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
    return;
  }

  try {
    const allUsers = await db.select().from(users).execute();

    for (const user of allUsers) {
      await db.update(users)
        .set({ balance: user.balance + 10 })
        .where(eq(users.id, user.id))
        .execute();
    }

    return NextResponse.json({ error: 'Balance updated successfully' }, {status: 200});
  } catch (error) {
    console.error('Error updating balances:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, {status: 500});
  }
}
