"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Users, FileText, Clock, CheckCircle } from "lucide-react"
import { Sidebar } from "../../components/ui/sidebar"
import { Header } from "../../components/Header"
import { StatsCard } from "../../components/ui/stats-card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tab"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"

export default function Dashboard() {
  const [message, setMessage] = useState("")
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Form states
  const [drugName, setDrugName] = useState("")
  const [patientName, setPatientName] = useState("")
  const [quantity, setQuantity] = useState(0)
  const [prescriptionID, setPrescriptionID] = useState("")
  const [amount, setAmount] = useState(0)
  const [dispenseInterval, setDispenseInterval] = useState("")

  useEffect(() => {
    const token = Cookies.get("token")
    console.log("login token")
    console.log(token)
    if (token) {
      setIsLoggedIn(true)
      fetchStats(token)
    }
  }, [])

  useEffect(() => {
    // Preset prescriptions
    const presetPrescriptions: Prescription[] = [
      { id: "23", patient_name: "John Doe", drug_name: "Medexorin", quantity: 30, status: "active" },
      { id: "27", patient_name: "Jane Smith", drug_name: "Painolol", quantity: 45, status: "active" },
      { id: "39", patient_name: "Alice Johnson", drug_name: "Oxytocin", quantity: 30, status: "completed" },
    ]
    setPrescriptions(presetPrescriptions)
  }, [])

  interface Prescription {
    id: string
    patient_name: string
    drug_name: string
    quantity: number
    status: string
  }

  const fetchStats = async (token: string | undefined) => {
    try {
      const res = await fetch("http://localhost:5000/stats", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setTotalPatients(data.totalPatients)
        setPrescriptions(data.activePrescriptions)
      } else {
        setMessage("Failed to load stats")
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage("An error occurred while fetching stats.")
    }
  }

  useEffect(() => {
    const token = Cookies.get("token")
    fetchPrescriptions(token)
  }, [])

  const fetchPrescriptions = async (token: string | undefined) => {
    try {
      const res = await fetch("http://localhost:5000/prescriptions-admin", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setDrugName(data.drugName)
        setMessage("Data loaded successfully!")
      } else {
        setMessage("Data failed to load!")
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePrescribe = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = Cookies.get("token")

    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/prescriptions-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          drug_name: drugName,
          patient_name: patientName,
          "quantity": quantity,
          dispense_interval: dispenseInterval,
          status: "active",
        })
      })
      console.log(JSON.stringify({
        drug_name: drugName,
        patient_name: patientName,
        "quantity": quantity,
        dispense_interval: dispenseInterval,
        status: "active",

      }))
      if (res.ok) {
        const newPrescription = await res.json()
        setPrescriptions((prevPrescriptions) => [...prevPrescriptions, newPrescription])
        setMessage("Prescription added successfully!")
      } else {
        setMessage("Prescription failed!")      }
    } catch (error) {
      console.error("Error:", error)
      setMessage("An error occurred while submitting data.")
    } finally {
      setLoading(false)
    }
  }

  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = Cookies.get("token")
    if (!token) {
      setMessage("You are not logged in.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/prescriptions/decrease", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: prescriptionID,
          amount,
        }),
      })

      if (res.ok) {
        setMessage("Medication dispensed successfully!")
        // Refresh prescriptions list
        fetchPrescriptions(token)
        // Reset form
        setPrescriptionID("")
        setAmount(0)
      } else {
        setMessage("Failed to dispense medication")
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage("An error occurred while dispensing medication.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={isLoggedIn} />

        <main className="flex-1 p-6">
            {isLoggedIn && (
            <div className="grid grid-cols-4 gap-6 mb-6">
              <StatsCard
              title="Total Patients"
              value={550}
              change={{ value: 10, timeframe: "Since last month" }}
              icon={Users}
              />
              <StatsCard
              title="Active Prescriptions"
              value={128}
              change={{ value: 5, timeframe: "Since last month" }}
              icon={FileText}
              />
              <StatsCard
              title="Pending Reviews"
              value={28}
              change={{ value: 12, timeframe: "Since last month" }}
              icon={Clock}
              />
              <StatsCard
              title="Completed Today"
              value={15}
              change={{ value: 8, timeframe: "Since last month" }}
              icon={CheckCircle}
              />
            </div>
            )}

          {message && <div className="mb-6 p-4 rounded bg-blue-50 text-blue-700">{message}</div>}

          <Tabs defaultValue="prescriptions">
            <TabsList>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>

            <TabsContent value="prescriptions">
              <div className="rounded-lg border bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Drug</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>{prescription.id}</TableCell>
                        <TableCell>{prescription.patient_name}</TableCell>
                        <TableCell>{prescription.drug_name}</TableCell>
                        <TableCell>{prescription.quantity}</TableCell>
                        <TableCell>active</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="create">
              <div className="rounded-lg border bg-white p-6">
                <form onSubmit={handlePrescribe} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="drugName">Drug Name</Label>
                    <Input id="drugName" value={drugName} onChange={(e) => setDrugName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dispenseInterval">Dispense Interval (hours)</Label>
                    <Input
                      id="dispenseInterval"
                      type="text"
                      value={dispenseInterval}
                      onChange={(e) => setDispenseInterval(e.target.value)}
                      placeholder="e.g. 12"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Prescription"}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="dispense">
              <div className="rounded-lg border bg-white p-6">
                <form onSubmit={handleDispense} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="prescriptionID">Prescription ID</Label>
                    <Input
                      id="prescriptionID"
                      value={prescriptionID}
                      onChange={(e) => setPrescriptionID(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Dispense</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Dispensing..." : "Dispense Medication"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
function setTotalPatients(totalPatients: any) {
  throw new Error("Function not implemented.")
}

