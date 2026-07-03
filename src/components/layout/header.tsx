import { LogOut, Package } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export function Header() {
  const { signOut } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2 md:hidden">
        <Package className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">Stock Manager</span>
      </div>
      <div className="hidden md:block" />
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  )
}
