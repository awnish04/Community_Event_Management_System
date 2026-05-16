import { redirect } from "next/navigation"

// Creation is handled via dialog on the activities list page
export default function CreateActivityPage() {
  redirect("/admin/activities")
}
