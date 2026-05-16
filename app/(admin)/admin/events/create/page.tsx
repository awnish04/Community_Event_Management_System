import { redirect } from "next/navigation"

// Creation is handled via dialog on the events list page
export default function CreateEventPage() {
  redirect("/admin/events")
}
