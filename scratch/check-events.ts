import { db } from "./db";
import { events } from "./db/schema";

async function checkEvents() {
  const allEvents = await db.select().from(events);
  console.log("Total events in DB:", allEvents.length);
  allEvents.forEach(e => {
    console.log(`- ${e.name} (${e.eventDate})`);
  });
  
  const now = new Date();
  console.log("Current Date (Server):", now);
}

checkEvents().catch(console.error);
