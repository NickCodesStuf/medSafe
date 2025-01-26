import type React from "react"
import { useState } from "react"

export const DispenseForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [prescriptionID, setPrescriptionID] = useState("")
  const [amount, setAmount] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ id: prescriptionID, amount })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Dispense Medication</h2>
      <div className="mb-4">
        <label htmlFor="prescriptionID" className="block text-gray-700 text-sm font-bold mb-2">
          Prescription ID:
        </label>
        <input
          id="prescriptionID"
          type="text"
          value={prescriptionID}
          onChange={(e) => setPrescriptionID(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
          Dispense amount:
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Dispense Medication
      </button>
    </form>
  )
}

