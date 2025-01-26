import Link from "next/link"
import { LayoutDashboard, Users, Calendar, MessageSquare, BarChart2, FileText, Settings } from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: MessageSquare, label: "Messages", href: "/messages", badge: "2" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: FileText, label: "Files", href: "/files" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 px-2 mb-8">
        <img src="../images/medsafe.png" alt="" className="contrast-480" />
        <div>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-5 rounded-lg text-sm ${
              item.active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

