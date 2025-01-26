import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"

interface StatsCardProps {
  title: string
  value: number
  change: {
    value: number
    timeframe: string
  }
  icon: LucideIcon
  iconColor?: string
}

export function StatsCard({ title, value, change, icon: Icon, iconColor = "text-teal-500" }: StatsCardProps) {
  const isPositive = change.value > 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {isPositive ? "+" : ""}
              {change.value}% {change.timeframe}
            </p>
          </div>
          <div className={`p-3 rounded-full ${iconColor} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

