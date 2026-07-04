import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowDown, ArrowUp } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { usePerformStockMovement } from "@/hooks/use-stock-movements"
import type { ProductWithCategory } from "@/types"
import { cn } from "@/lib/utils"

const adjustmentSchema = z.object({
  type: z.enum(["in", "out"]),
  quantity: z.number().int().min(1, "Must be at least 1"),
  reason: z.string().optional(),
})

type AdjustmentValues = z.infer<typeof adjustmentSchema>

export function StockAdjustmentDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductWithCategory | null
}) {
  const performMovement = usePerformStockMovement()

  const form = useForm<AdjustmentValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: { type: "in", quantity: 1, reason: "" },
  })

  useEffect(() => {
    if (open) {
      form.reset({ type: "in", quantity: 1, reason: "" })
    }
  }, [open, form])

  if (!product) return null

  const selectedType = form.watch("type")

  const onSubmit = async (values: AdjustmentValues) => {
    try {
      await performMovement.mutateAsync({
        productId: product.id,
        type: values.type,
        quantity: values.quantity,
        reason: values.reason,
      })
      toast.success(
        values.type === "in"
          ? `Added ${values.quantity} to "${product.name}"`
          : `Removed ${values.quantity} from "${product.name}"`
      )
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to adjust stock"
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock — {product.name}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Current stock: <span className="font-medium text-foreground">{product.quantity} {product.unit}s</span>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={field.value === "in" ? "default" : "outline"}
                        className={cn(field.value === "in" && "bg-green-600 hover:bg-green-700")}
                        onClick={() => field.onChange("in")}
                      >
                        <ArrowDown className="h-4 w-4" />
                        Stock In
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "out" ? "default" : "outline"}
                        className={cn(field.value === "out" && "bg-red-600 hover:bg-red-700")}
                        onClick={() => field.onChange("out")}
                      >
                        <ArrowUp className="h-4 w-4" />
                        Stock Out
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        selectedType === "in"
                          ? "e.g. Purchase order #123"
                          : "e.g. Sold to customer"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
