import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDeleteProduct } from "@/hooks/use-products"
import { getStockStatus } from "@/types"
import type { ProductWithCategory } from "@/types"
import { cn } from "@/lib/utils"

const stockStatusConfig = {
  ok: { label: "In Stock", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  low: { label: "Low Stock", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  out: { label: "Out of Stock", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
}

export function ProductCard({
  product,
  onEdit,
  onAdjust,
}: {
  product: ProductWithCategory
  onEdit: () => void
  onAdjust: () => void
}) {
  const deleteProduct = useDeleteProduct()
  const status = getStockStatus(product)
  const config = stockStatusConfig[status]

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success(`Deleted "${product.name}"`)
    } catch {
      toast.error("Failed to delete product")
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        status === "out" && "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30",
        status === "low" && "border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/30"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{product.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {product.sku && (
              <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
            )}
            {product.categories && (
              <Badge variant="outline" className="text-xs">
                <div
                  className="mr-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: product.categories.color }}
                />
                {product.categories.name}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">{product.quantity}</span>
          <span className="ml-1 text-sm text-muted-foreground">{product.unit}s</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={config.className} variant="secondary">
            {config.label}
          </Badge>
          <Button variant="outline" size="sm" onClick={onAdjust}>
            Adjust
          </Button>
        </div>
      </div>
    </div>
  )
}
