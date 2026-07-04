import { ArrowDownCircle, ArrowUpCircle, RefreshCw, Package } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useStockMovements } from "@/hooks/use-stock-movements"
import { Badge } from "@/components/ui/badge"

const typeConfig = {
  in: { label: "Stock In", icon: ArrowDownCircle, className: "text-green-600" },
  out: { label: "Stock Out", icon: ArrowUpCircle, className: "text-red-600" },
  adjustment: { label: "Adjustment", icon: RefreshCw, className: "text-yellow-600" },
  initial: { label: "Initial", icon: Package, className: "text-blue-600" },
}

export default function MovementsPage() {
  const { data: movements, isLoading } = useStockMovements()

  return (
    <div>
      <h1 className="text-2xl font-bold">Stock Movements</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        History of all stock changes across products.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !movements?.length ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No stock movements yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {movements.map((movement) => {
              const config = typeConfig[movement.type]
              const Icon = config.icon
              return (
                <div
                  key={movement.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <Icon className={`h-5 w-5 shrink-0 ${config.className}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {movement.products?.name ?? "Deleted product"}
                      </span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {config.label}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {movement.quantity_before} → {movement.quantity_after}
                      {movement.reason && ` · ${movement.reason}`}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-lg font-bold ${config.className}`}>
                      {movement.type === "in" || movement.type === "initial" ? "+" : "−"}
                      {movement.quantity}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(movement.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
