export type Profile = {
  id: string
  full_name: string
  role: "owner" | "admin" | "member"
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  description: string | null
  color: string
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  sku: string | null
  barcode: string | null
  category_id: string | null
  unit: string
  quantity: number
  low_stock_threshold: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export type ProductWithCategory = Product & {
  categories: Category | null
}

export type StockMovement = {
  id: string
  product_id: string
  type: "in" | "out" | "adjustment" | "initial"
  quantity: number
  quantity_before: number
  quantity_after: number
  reason: string | null
  performed_by: string
  created_at: string
}

export type StockMovementWithDetails = StockMovement & {
  products: { name: string } | null
  profiles: { full_name: string } | null
}

export type StockStatus = "ok" | "low" | "out"

export function getStockStatus(product: Product): StockStatus {
  if (product.quantity === 0) return "out"
  if (product.quantity <= product.low_stock_threshold) return "low"
  return "ok"
}
