import type React from "react"
import Link from "next/link"
import { Home, Clipboard, PlusCircle, Droplet } from "lucide-react"

export const Sidebar: React.FC = () => {
  return (
    <div className="bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white">
          <Home className="inline-block mr-2" size={20} />
          Dashboard
        </Link>
        <Link
          href="/prescriptions"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white"
        >
          <Clipboard className="inline-block mr-2" size={20} />
          Prescriptions
        </Link>
        <Link
          href="/new-prescription"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white"
        >
          <PlusCircle className="inline-block mr-2" size={20} />
          New Prescription
        </Link>
        <Link
          href="/dispense"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white"
        >
          <Droplet className="inline-block mr-2" size={20} />
          Dispense
        </Link>
      </nav>
    </div>
  )
}

