import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { ProductWithCategory } from "@/types"

type ProductFilters = {
  search?: string
  categoryId?: string
  stockStatus?: "all" | "low" | "out"
  sortBy?: "name" | "quantity" | "created_at"
  sortOrder?: "asc" | "desc"
}

export function useProducts(filters: ProductFilters = {}) {
  const {
    search,
    categoryId,
    stockStatus,
    sortBy = "name",
    sortOrder = "asc",
  } = filters

  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, categories(*)")

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`
        )
      }

      if (categoryId) {
        query = query.eq("category_id", categoryId)
      }

      if (stockStatus === "out") {
        query = query.eq("quantity", 0)
      }

      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      const { data, error } = await query
      if (error) throw error

      let products = data as ProductWithCategory[]

      // Client-side filter for low stock (quantity <= threshold requires comparing two columns)
      if (stockStatus === "low") {
        products = products.filter(
          (p) => p.quantity > 0 && p.quantity <= p.low_stock_threshold
        )
      }

      return products
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .eq("id", id)
        .single()
      if (error) throw error
      return data as ProductWithCategory
    },
    enabled: !!id,
  })
}

type CreateProductInput = {
  name: string
  description?: string
  sku?: string
  barcode?: string
  category_id?: string | null
  unit?: string
  quantity?: number
  low_stock_threshold?: number
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const { data: userData } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from("products")
        .insert({ ...input, created_by: userData.user?.id })
        .select("*, categories(*)")
        .single()
      if (error) throw error
      return data as ProductWithCategory
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

type UpdateProductInput = {
  id: string
  name?: string
  description?: string | null
  sku?: string | null
  barcode?: string | null
  category_id?: string | null
  unit?: string
  low_stock_threshold?: number
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateProductInput) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select("*, categories(*)")
        .single()
      if (error) throw error
      return data as ProductWithCategory
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
