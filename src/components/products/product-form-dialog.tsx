import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import type { ProductWithCategory } from "@/types"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category_id: z.string().optional(),
  unit: z.string().min(1),
  quantity: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0),
})

type ProductValues = z.infer<typeof productSchema>

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductWithCategory | null
}) {
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const { data: categories } = useCategories()
  const isEditing = !!product

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      barcode: "",
      category_id: "",
      unit: "unit",
      quantity: 0,
      low_stock_threshold: 10,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        product
          ? {
              name: product.name,
              description: product.description ?? "",
              sku: product.sku ?? "",
              barcode: product.barcode ?? "",
              category_id: product.category_id ?? "",
              unit: product.unit,
              quantity: product.quantity,
              low_stock_threshold: product.low_stock_threshold,
            }
          : {
              name: "",
              description: "",
              sku: "",
              barcode: "",
              category_id: "",
              unit: "unit",
              quantity: 0,
              low_stock_threshold: 10,
            }
      )
    }
  }, [open, product, form])

  const onSubmit = async (values: ProductValues) => {
    try {
      if (isEditing) {
        await updateProduct.mutateAsync({
          id: product.id,
          name: values.name,
          description: values.description || undefined,
          sku: values.sku || undefined,
          barcode: values.barcode || undefined,
          category_id: values.category_id || undefined,
          unit: values.unit,
          low_stock_threshold: values.low_stock_threshold,
        })
        toast.success(`Updated "${values.name}"`)
      } else {
        await createProduct.mutateAsync({
          name: values.name,
          description: values.description || undefined,
          sku: values.sku || undefined,
          barcode: values.barcode || undefined,
          category_id: values.category_id || undefined,
          unit: values.unit,
          quantity: values.quantity,
          low_stock_threshold: values.low_stock_threshold,
        })
        toast.success(`Created "${values.name}"`)
      }
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Operation failed"
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ELEC-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditing && (
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Qty</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="low_stock_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock At</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
