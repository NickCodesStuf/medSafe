"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, ChevronDown, Home, Pill, DollarSign, Users, Phone } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button" 
import "./page.css"

const Sidebar = ({
  activeSection,
  setActiveSection,
}: { activeSection: string; setActiveSection: (section: string) => void }) => {
  const menuItems = [
    { name: "Overview", icon: Home },
    { name: "Medications", icon: Pill },
    { name: "Payments", icon: DollarSign },
    { name: "Providers", icon: Users },
    { name: "Contact", icon: Phone },
  ]

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 fixed left-0 top-0 bottom-0">
      <h1 className="text-2xl font-bold mb-8">PatientCare</h1>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`flex items-center w-full p-2 rounded-lg mb-2 ${
              activeSection === item.name ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSection(item.name)}
          >
            <item.icon className="mr-2" />
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  )
}

const Header = () => (
  <header className="bg-white shadow-sm p-4 flex justify-between items-center fixed top-0 right-0 left-64 z-10">
    <h2 className="text-xl font-semibold">Patient Dashboard</h2>
    <div className="flex items-center">
      <Bell className="mr-4" />
      <div className="flex items-center">
        <img src="/placeholder.svg?height=32&width=32" alt="User" className="w-8 h-8 rounded-full mr-2" />
        <span className="mr-2">John Doe</span>
        <ChevronDown />
      </div>
    </div>
  </header>
)

const medicationData = [
  { name: "Jan", prescriptions: 3 },
  { name: "Feb", prescriptions: 4 },
  { name: "Mar", prescriptions: 2 },
  { name: "Apr", prescriptions: 5 },
  { name: "May", prescriptions: 3 },
]

const paymentData = [
  { name: "Jan", amount: 150 },
  { name: "Feb", amount: 200 },
  { name: "Mar", amount: 100 },
  { name: "Apr", amount: 300 },
  { name: "May", amount: 250 },
]

const providerData = [
  { name: "Dr. Smith", visits: 3 },
  { name: "Dr. Johnson", visits: 2 },
  { name: "Dr. Williams", visits: 1 },
  { name: "Dr. Brown", visits: 2 },
  { name: "Dr. Jones", visits: 1 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const DashboardContent = ({ activeSection, sectionRefs }: { activeSection: string; sectionRefs: any }) => (
  <div className="space-y-8">
    <section ref={sectionRefs.Overview} className="pt-20">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 new this month</p>
            <div className="line-chart">
              {medicationData.map((data, index) => (
                <div
                  key={data.name}
                  className="line"
                  style={{
                    transform: `translate(${index * 25}%, ${100 - data.prescriptions * 20}%) rotate(45deg)`,
                    width: "25%",
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$250</div>
            <p className="text-xs text-muted-foreground">Last payment on May 15</p>
            <div className="chart">
              {paymentData.map((data) => (
                <div
                  key={data.name}
                  className="bar"
                  style={{ height: `${data.amount / 3}%` }}
                  title={`${data.name}: $${data.amount}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provider Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">Across 5 providers</p>
            <div className="flex justify-center">
              <div className="pie-chart" />
            </div>
            <div className="legend">
              {providerData.map((data, index) => (
                <div key={data.name} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{data.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <section ref={sectionRefs.Medications} className="pt-20">
      <h2 className="text-2xl font-bold mb-4">Medications</h2>
      <Card>
        <CardHeader>
          <CardTitle>Medication History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Lisinopril</p>
                <p className="text-sm text-muted-foreground">10mg, once daily</p>
              </div>
              <p className="text-sm">Started: Jan 15, 2023</p>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Metformin</p>
                <p className="text-sm text-muted-foreground">500mg, twice daily</p>
              </div>
              <p className="text-sm">Started: Mar 1, 2023</p>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Atorvastatin</p>
                <p className="text-sm text-muted-foreground">20mg, once daily</p>
              </div>
              <p className="text-sm">Started: Apr 10, 2023</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>

    <section ref={sectionRefs.Payments} className="pt-20">
      <h2 className="text-2xl font-bold mb-4">Payments</h2>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Office Visit</p>
                <p className="text-sm text-muted-foreground">Dr. Smith</p>
              </div>
              <p className="font-medium">$150</p>
              <p className="text-sm">Paid on May 15, 2023</p>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Lab Tests</p>
                <p className="text-sm text-muted-foreground">Annual Check-up</p>
              </div>
              <p className="font-medium">$200</p>
              <p className="text-sm">Paid on Apr 3, 2023</p>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Prescription Refill</p>
                <p className="text-sm text-muted-foreground">Lisinopril</p>
              </div>
              <p className="font-medium">$25</p>
              <p className="text-sm">Paid on Mar 20, 2023</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>

    <section ref={sectionRefs.Providers} className="pt-20">
      <h2 className="text-2xl font-bold mb-4">Providers</h2>
      <Card>
        <CardHeader>
          <CardTitle>Your Healthcare Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dr. Emily Smith</p>
                <p className="text-sm text-muted-foreground">Primary Care Physician</p>
              </div>
              <Button variant="outline">Contact</Button>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dr. Michael Johnson</p>
                <p className="text-sm text-muted-foreground">Cardiologist</p>
              </div>
              <Button variant="outline">Contact</Button>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dr. Sarah Williams</p>
                <p className="text-sm text-muted-foreground">Endocrinologist</p>
              </div>
              <Button variant="outline">Contact</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>

    <section ref={sectionRefs.Contact} className="pt-20">
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  </div>
)

export default function PatientDashboard() {
  const [activeSection, setActiveSection] = useState("Overview")
  const sectionRefs = {
    Overview: useRef<HTMLElement>(null),
    Medications: useRef<HTMLElement>(null),
    Payments: useRef<HTMLElement>(null),
    Providers: useRef<HTMLElement>(null),
    Contact: useRef<HTMLElement>(null),
  }

  useEffect(() => {
    const sectionRef = sectionRefs[activeSection as keyof typeof sectionRefs]
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeSection])

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8 pt-24">
          <DashboardContent activeSection={activeSection} sectionRefs={sectionRefs} />
        </main>
      </div>
    </div>
  )
}

