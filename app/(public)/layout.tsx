import { ConditionalNavigation } from "@/components/conditional-navigation"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ConditionalNavigation />
      <div className="pt-16">{children}</div>
    </>
  )
}
