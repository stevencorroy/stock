import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/hooks/use-categories"

type Filters = {
  search: string
  categoryId: string
  stockStatus: string
  sortBy: string
}

export function ProductFilters({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
}) {
  const { data: categories } = useCategories()

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, SKU, or barcode..."
          className="pl-9"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <Select
        value={filters.categoryId}
        onValueChange={(v) => onChange({ ...filters, categoryId: v })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
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
      <Select
        value={filters.stockStatus}
        onValueChange={(v) => onChange({ ...filters, stockStatus: v })}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Stock status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stock</SelectItem>
          <SelectItem value="low">Low stock</SelectItem>
          <SelectItem value="out">Out of stock</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.sortBy}
        onValueChange={(v) => onChange({ ...filters, sortBy: v })}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="quantity">Quantity</SelectItem>
          <SelectItem value="created_at">Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
