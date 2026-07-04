import { Package, BoxesIcon, AlertTriangle, XCircle, ArrowDownCircle, ArrowUpCircle, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useStockMovements } from "@/hooks/use-stock-movements"

const movementIcons = {
  in: ArrowDownCircle,
  out: ArrowUpCircle,
  adjustment: RefreshCw,
  initial: Package,
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: movements, isLoading: movementsLoading } = useStockMovements()
  const recentMovements = movements?.slice(0, 10)

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Stock",
      value: stats?.totalStock ?? 0,
      icon: BoxesIcon,
      color: "text-green-600",
    },
    {
      title: "Low Stock",
      value: stats?.lowStockCount ?? 0,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      title: "Out of Stock",
      value: stats?.outOfStockCount ?? 0,
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {statsLoading ? "—" : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : !stats?.lowStockProducts.length ? (
              <p className="text-sm text-muted-foreground">All products are well stocked.</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{product.name}</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      {product.quantity} / {product.low_stock_threshold}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {movementsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : !recentMovements?.length ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {recentMovements.map((m) => {
                  const Icon = movementIcons[m.type]
                  return (
                    <div key={m.id} className="flex items-center gap-3 text-sm">
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate flex-1">
                        {m.type === "in" || m.type === "initial" ? "+" : "−"}{m.quantity}{" "}
                        {m.products?.name ?? "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
