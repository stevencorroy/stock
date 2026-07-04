import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { StockMovementWithDetails } from "@/types"

export function useStockMovements(productId?: string) {
  return useQuery({
    queryKey: ["stock-movements", productId],
    queryFn: async () => {
      let query = supabase
        .from("stock_movements")
        .select("*, products(name), profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(50)

      if (productId) {
        query = query.eq("product_id", productId)
      }

      const { data, error } = await query
      if (error) throw error
      return data as StockMovementWithDetails[]
    },
  })
}

export function usePerformStockMovement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      productId,
      type,
      quantity,
      reason,
    }: {
      productId: string
      type: "in" | "out" | "adjustment"
      quantity: number
      reason?: string
    }) => {
      const { data, error } = await supabase.rpc("perform_stock_movement", {
        p_product_id: productId,
        p_type: type,
        p_quantity: quantity,
        p_reason: reason || null,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
    },
  })
}
