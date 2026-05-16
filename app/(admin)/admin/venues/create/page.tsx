import { redirect } from "next/navigation"

// Creation is handled via dialog on the venues list page
export default function CreateVenuePage() {
  redirect("/admin/venues")
}
