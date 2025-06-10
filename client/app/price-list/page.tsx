import { DashboardLayout } from "@/components/dashboard-layout"
import { PriceListModule } from "@/components/price-list-module"

export default function PriceListPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00D4FF] to-[#00FF88] bg-clip-text text-transparent">
            Price List
          </h1>
          <p className="text-muted-foreground mt-2">Manage and edit your master pricing</p>
        </div>
        <PriceListModule />
      </div>
    </DashboardLayout>
  )
}
