import { Users, FileText, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

const stats = [
  {
    name: "Total Patients",
    value: "550",
    change: "+10%",
    changeLabel: "Since last month",
    icon: Users
  },
  {
    name: "Active Prescriptions",
    value: "128",
    change: "+5%",
    changeLabel: "Since last month",
    icon: FileText
  },
  {
    name: "Pending Reviews",
    value: "28",
    change: "-2%",
    changeLabel: "Since last month",
    icon: Clock
  },
  {
    name: "Completed Today",
    value: "15",
    change: "+8%",
    changeLabel: "Since last month",
    icon: CheckCircle
  }
]

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} {stat.changeLabel}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
