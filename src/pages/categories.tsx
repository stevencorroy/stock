import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-categories"
import { CategoryList } from "@/components/categories/category-list"
import { CategoryFormDialog } from "@/components/categories/category-form-dialog"
import type { Category } from "@/types"

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !categories?.length ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No categories yet.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => { setEditing(null); setDialogOpen(true) }}
            >
              Create your first category
            </Button>
          </div>
        ) : (
          <CategoryList
            categories={categories}
            onEdit={(cat) => { setEditing(cat); setDialogOpen(true) }}
          />
        )}
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
      />
    </div>
  )
}
