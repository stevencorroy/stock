import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useDeleteCategory } from "@/hooks/use-categories"
import type { Category } from "@/types"

export function CategoryList({
  categories,
  onEdit,
}: {
  categories: Category[]
  onEdit: (category: Category) => void
}) {
  const deleteCategory = useDeleteCategory()

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete "${category.name}"? Products in this category will become uncategorized.`)) {
      return
    }
    try {
      await deleteCategory.mutateAsync(category.id)
      toast.success(`Deleted "${category.name}"`)
    } catch {
      toast.error("Failed to delete category")
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <div>
              <p className="font-medium">{category.name}</p>
              {category.description && (
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(category)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(category)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
