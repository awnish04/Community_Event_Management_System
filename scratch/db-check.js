import 'dotenv/config';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';

async function main() {
  const evs = await db.select().from(schema.events);
  const acts = await db.select().from(schema.activities);
  const evActs = await db.select().from(schema.eventActivities);
  console.log("=== DB CHECK ===");
  console.log("EVENTS COUNT:", evs.length);
  console.log("ACTIVITIES COUNT:", acts.length);
  console.log("EVENT-ACTIVITIES COUNT:", evActs.length);
  console.log("\nEVENTS:", JSON.stringify(evs, null, 2));
  console.log("\nACTIVITIES:", JSON.stringify(acts, null, 2));
  console.log("\nEVENT-ACTIVITIES:", JSON.stringify(evActs, null, 2));
}

main().catch(console.error);
