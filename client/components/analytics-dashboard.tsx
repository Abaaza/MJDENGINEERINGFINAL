"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Clock } from "lucide-react"

const metrics = [
  {
    title: "Monthly Revenue",
    value: "$485,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Quotations Sent",
    value: "127",
    change: "+8.2%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Active Clients",
    value: "34",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Avg. Response Time",
    value: "2.4 hrs",
    change: "-18.7%",
    trend: "up",
    icon: Clock,
  },
]

const projectTypes = [
  { name: "Commercial Buildings", value: 45, color: "#00D4FF" },
  { name: "Residential Projects", value: 30, color: "#00FF88" },
  { name: "Infrastructure", value: 15, color: "#FF6B35" },
  { name: "Industrial", value: 10, color: "#FACC15" },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass-effect border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 neon-green mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${metric.trend === "up" ? "neon-green" : "text-red-400"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#00D4FF]/20 glow-blue">
                  <metric.icon className="h-6 w-6 neon-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Types Distribution */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Project Types Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectTypes.map((type, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{type.name}</span>
                  <span className="text-gray-400">{type.value}%</span>
                </div>
                <Progress value={type.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                <div className="w-2 h-2 bg-[#00FF88] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Quotation QT-2024-007 approved</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                <div className="w-2 h-2 bg-[#00D4FF] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">New client Metro Construction added</p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Excel file processed: 45 items</p>
                  <p className="text-xs text-gray-400">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
