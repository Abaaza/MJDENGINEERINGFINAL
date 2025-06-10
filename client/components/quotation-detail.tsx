"use client"

import { useState, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusTimeline } from "@/components/status-timeline"
import { EditableTable } from "@/components/editable-table"
import { ClientDrawer } from "@/components/client-drawer"
import { UploadModule } from "@/components/upload-module"
import { ArrowLeft, Edit, Save, Send, User } from "lucide-react"
import Link from "next/link"

interface QuotationDetailProps {
  quotationId: string
}

interface TimelineItem {
  status: string
  date: string
  description: string
}

interface QuotationData {
  id: string
  client: string
  project: string
  value: string
  status: string
  date: string
  items: number
  description: string
  timeline: TimelineItem[]
}

export const QuotationDetail = memo(function QuotationDetail({ quotationId }: QuotationDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showClientDrawer, setShowClientDrawer] = useState(false)

  // Mock data - in real app, this would come from API
  const quotation: QuotationData = {
    id: quotationId,
    client: "Metro Construction Ltd.",
    project: "Downtown Office Complex",
    value: "$1,250,000",
    status: "pending",
    date: "2024-01-15",
    items: 45,
    description:
      "Complete construction quotation for a 15-story office complex including structural work, MEP systems, and finishing.",
    timeline: [
      { status: "created", date: "2024-01-15", description: "Quotation created" },
      { status: "uploaded", date: "2024-01-15", description: "Excel file uploaded" },
      { status: "processing", date: "2024-01-15", description: "Pricing logic applied" },
      { status: "review", date: "2024-01-16", description: "Under review by engineering team" },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 ripple">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{quotation.id}</h1>
            <p className="text-gray-400">{quotation.project}</p>
          </div>
          <Badge className="status-pending border rounded-full px-3 py-1">PENDING</Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowClientDrawer(true)}
            className="w-full sm:w-auto border-white/20 hover:bg-white/10 ripple"
          >
            <User className="h-4 w-4 mr-2" />
            Client Info
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="w-full sm:w-auto border-white/20 hover:bg-white/10 ripple"
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-[#00D4FF] to-[#00FF88] hover:from-[#00D4FF]/80 hover:to-[#00FF88]/80 text-black font-semibold ripple glow-blue">
            <Send className="h-4 w-4 mr-2" />
            Send Quote
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="glass-effect border-white/10">
              <TabsTrigger
                value="items"
                className="data-[state=active]:bg-[#00D4FF]/20 data-[state=active]:text-[#00D4FF]"
              >
                Items & Pricing
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-[#00D4FF]/20 data-[state=active]:text-[#00D4FF]"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-[#00D4FF]/20 data-[state=active]:text-[#00D4FF]"
              >
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-6">
              <EditableTable isEditing={isEditing} />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <UploadModule />
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Project Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{quotation.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Items:</span>
                <span className="text-white font-semibold">{quotation.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-white font-semibold">$1,125,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax (10%):</span>
                <span className="text-white font-semibold">$112,500</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4">
                <span className="text-gray-400">Total:</span>
                <span className="text-2xl font-bold neon-blue">{quotation.value}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <StatusTimeline timeline={quotation.timeline} />
        </div>
      </div>

      {/* Client Drawer */}
      <ClientDrawer open={showClientDrawer} onClose={() => setShowClientDrawer(false)} client={quotation.client} />
    </div>
  )
})
