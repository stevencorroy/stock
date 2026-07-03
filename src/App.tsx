import { BrowserRouter, Routes, Route } from "react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "@/lib/query-client"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AppLayout } from "@/components/layout/app-layout"
import LoginPage from "@/pages/login"
import SignupPage from "@/pages/signup"
import DashboardPage from "@/pages/dashboard"
import ProductsPage from "@/pages/products"
import MovementsPage from "@/pages/movements"
import CategoriesPage from "@/pages/categories"
import SettingsPage from "@/pages/settings"

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="movements" element={<MovementsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}
