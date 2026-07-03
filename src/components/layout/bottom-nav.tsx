import { NavLink } from "react-router"
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Tags,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/movements", label: "History", icon: ArrowLeftRight },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
