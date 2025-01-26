// pages/prescriptions.tsx
import { useEffect, useState } from "react";

interface Prescription {
  id: number;
  drug_name: string;
  patient_name: string;
  quantity: number;
}

export const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch prescriptions from the API
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch("/prescriptions"); // Assuming this is the correct API endpoint
        if (!res.ok) {
          throw new Error("Failed to fetch prescriptions");
        }
        const data = await res.json();
        setPrescriptions(data);
      } catch (err) {
        setError("Error fetching prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // If data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there was an error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Prescriptions List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Drug Name</th>
              <th className="border px-4 py-2">Patient Name</th>
              <th className="border px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td className="border px-4 py-2">{prescription.id}</td>
                  <td className="border px-4 py-2">{prescription.drug_name}</td>
                  <td className="border px-4 py-2">{prescription.patient_name}</td>
                  <td className="border px-4 py-2">{prescription.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border px-4 py-2 text-center">
                  No prescriptions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prescriptions;
