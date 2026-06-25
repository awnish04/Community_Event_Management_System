/**
 * Setup Admin Script
 *
 * Creates or resets the single administrator account.
 * Run once after a new DATABASE_URL is set:
 *   npx tsx db/setup-admin.ts
 *
 * Does NOT touch users, events, venues, activities, or registrations.
 */
import { db } from "./index"
import { administrators } from "./schema"

async function setupAdmin() {
  // Remove any existing admin rows (there should only ever be one)
  await db.delete(administrators)

  const [admin] = await db
    .insert(administrators)
    .values({
      name: "Admin",
      email: "admin@eventhub.com",
      password: "admin123",
    })
    .returning()

  console.log("✅ Administrator account created:")
  console.log(`   Email:    ${admin.email}`)
  console.log(`   Password: admin123`)
  console.log(`   ID:       ${admin.id}`)
  console.log("\n⚠️  Change this password before going to production.")
}

setupAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err)
    process.exit(1)
  })
