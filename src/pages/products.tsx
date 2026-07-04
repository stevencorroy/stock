import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductFormDialog } from "@/components/products/product-form-dialog"
import { StockAdjustmentDialog } from "@/components/products/stock-adjustment-dialog"
import type { ProductWithCategory } from "@/types"

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "all",
    stockStatus: "all",
    sortBy: "name",
  })

  const { data: products, isLoading } = useProducts({
    search: filters.search || undefined,
    categoryId: filters.categoryId !== "all" ? filters.categoryId : undefined,
    stockStatus: filters.stockStatus as "all" | "low" | "out",
    sortBy: filters.sortBy as "name" | "quantity" | "created_at",
    sortOrder: filters.sortBy === "created_at" ? "desc" : "asc",
  })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ProductWithCategory | null>(null)
  const [adjusting, setAdjusting] = useState<ProductWithCategory | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="mt-4">
        <ProductFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !products?.length ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              {filters.search || filters.categoryId !== "all" || filters.stockStatus !== "all"
                ? "No products match your filters."
                : "No products yet."}
            </p>
            {!filters.search && filters.categoryId === "all" && filters.stockStatus === "all" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => { setEditing(null); setFormOpen(true) }}
              >
                Add your first product
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => { setEditing(product); setFormOpen(true) }}
                onAdjust={() => setAdjusting(product)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
      />
      <StockAdjustmentDialog
        open={!!adjusting}
        onOpenChange={(open) => !open && setAdjusting(null)}
        product={adjusting}
      />
    </div>
  )
}
