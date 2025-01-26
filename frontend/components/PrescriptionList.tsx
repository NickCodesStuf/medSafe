import type React from "react"

export const PrescriptionList: React.FC<{ prescriptions: any[] }> = ({ prescriptions }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">
              Drug Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase tracking-wider">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{prescription.id}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{prescription.drug_name}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{prescription.patient_name}</td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{prescription.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

