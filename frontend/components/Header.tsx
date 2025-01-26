import { ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface HeaderProps {
  isLoggedIn: boolean
  doctorName?: string
}

export function Header({ isLoggedIn, doctorName = "Dr. Miglani" }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="relative">
          <Button variant="outline">
            January 2025
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>


        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <img src="../images/image.png" alt="" className="h-8 w-8 rounded-full" />
                {doctorName}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button>Login</Button>
        )}
    </header>
  )
}

