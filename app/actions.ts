"use server"
import {db} from '@/lib/db'
import {teams} from '@/lib/db/schema'

export async function createTeam(formData : FormData) {

    const team_name = formData.get("team_name") as string
    const owner_id = formData.get("owner_id") as string

    await db.insert(teams).values({
        name: team_name,
        ownerId: owner_id
      });
}