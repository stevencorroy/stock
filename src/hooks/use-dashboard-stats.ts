import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types"

export type DashboardStats = {
  totalProducts: number
  totalStock: number
  lowStockCount: number
  outOfStockCount: number
  lowStockProducts: Product[]
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")

      if (error) throw error
      const products = data as Product[]

      const totalProducts = products.length
      const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)
      const outOfStockCount = products.filter((p) => p.quantity === 0).length
      const lowStockProducts = products.filter(
        (p) => p.quantity > 0 && p.quantity <= p.low_stock_threshold
      )

      return {
        totalProducts,
        totalStock,
        lowStockCount: lowStockProducts.length,
        outOfStockCount,
        lowStockProducts: lowStockProducts.sort(
          (a, b) => a.quantity / a.low_stock_threshold - b.quantity / b.low_stock_threshold
        ),
      } satisfies DashboardStats
    },
  })
}
