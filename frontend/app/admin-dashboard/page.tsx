"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchExternalImage } from "next/dist/server/image-optimizer";

interface JsonData {
  [key: string]: any;
}

const JsonToTable: React.FC<{ rawResponse: string }> = ({ rawResponse }) => {
  const [tableData, setTableData] = useState<JsonData[]>([]);

  useEffect(() => {
    try {
      const parsedData = JSON.parse(rawResponse);
      if (Array.isArray(parsedData)) {
        setTableData(parsedData);
      } else {
        setTableData([parsedData]);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setTableData([]);
    }
  }, [rawResponse]);

  return (
    <table className="table-auto border-collapse border border-gray-300">
      <thead>
        <tr>
          {tableData.length > 0 &&
            Object.keys(tableData[0]).map((key) => (
              <th key={key} className="border border-gray-300 p-2">
                {key}
              </th>
            ))}
          </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, i) => (
              <td key={i} className="border border-gray-300 p-2">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Page = () => {
  const [message, setMessage] = useState("");
  const [rawResponse, setRawResponse] = useState<string>(""); // Store the raw response as string
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setMessage("You are not logged in.");
      setLoading(false); // Stop loading if token is not present
    } else {
      setMessage("Loading data...");
      fetchPrescriptionData(token);
    }
  }, []);

  const fetchPrescriptionData = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/prescriptions-admin", {
        method: "GET",
        headers: {
          Accept: "application/json", // Accept header for JSON response
          Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
        },
      });

      const data = await res.text(); // Use .text() to get raw response as string

      if (res.status === 200) {
        // If the status code is 200, it's a success
        setRawResponse(data); // Set the raw response text
        setMessage("Data loaded successfully!");
      } else {
        // If the status code is not 200, show a fail message
        setMessage("Failed to fetch data");
        setRawResponse(data); // Show the raw error message
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("An error occurred while fetching data.");
      // setRawResponse("Error fetching data");
      setLoading(false);
    }
  };

  const [drugName, setDrugName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const handlePrescribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("token");
    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    setLoading(true);
    setMessage("Sending data...");

    try {
      const res = await fetch("http://localhost:5000/prescriptions-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Content-Type header for JSON payload
          Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
        },
        body: JSON.stringify({
          drug_name: drugName,
          patient_name: patientName,
          quantity,
        }),
      });
      fetchPrescriptionData(token);

      if (res.status === 200) {
        // If the status code is 200, it's a success
        // setRawResponse(data); // Set the raw response text
        setMessage("Prescription added successfully!");
      } else {
        // If the status code is not 200, show a fail message
        setMessage("Failed to add prescription");
        // setRawResponse(data); // Show the raw error message
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("An error occurred while submitting data.");
      // setRawResponse("Error submitting data");
    } finally {
      setLoading(false);
    }
  };

  const [prescriptionID, setPrescriptionID] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [frequency, setFrequency] = useState("");
  const [dispenseQuantity, setDispenseQuantity] = useState(0);
  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("token");
    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    setLoading(true);
    setMessage("Sending data...");

    const formatted_start = startDatetime
      .toString()
      .replace(/[^0-9]/g, "")
      .slice(2);
    try {
      const res = await fetch("http://localhost:5000/prescriptions/decrease", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Content-Type header for JSON payload
          Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
        },
        body: JSON.stringify({
          id: prescriptionID,
          amount: dispenseQuantity,
        }),
      });

      const res2 = await fetch("http://localhost:5000/api/serial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Content-Type header for JSON payload
        },
        body: JSON.stringify({
          start_datetime: formatted_start,
          quantity: dispenseQuantity,
          frequency: frequency,
        }),
      });

      fetchPrescriptionData(token);
      if (res.status === 200 && res2.status === 200) {
        // If the status code is 200, it's a success
        // setRawResponse(data); // Set the raw response text
        setMessage("Prescription decreased!");
      } else {
        // If the status code is not 200, show a fail message
        setMessage("Failed to decrease prescription");
        // setRawResponse(data + data2); // Show the raw error message
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("An error occurred while submitting data.");
      // setRawResponse("Error submitting data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <h1>Prescription data: </h1>
        <div>
          <JsonToTable rawResponse={rawResponse}/>
        </div>
        <p>{message}</p>
      </div>

      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <h1>Create new prescription</h1>
        <h1>{message}</h1>

        <form onSubmit={handlePrescribe} className="space-y-4">
          <div>
            <label htmlFor="drugName">Drug Name:</label>
            <input
              id="drugName"
              type="text"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              className="border p-2"
            />
          </div>

          <div>
            <label htmlFor="patientName">Patient Name:</label>
            <input
              id="patientName"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="border p-2"
            />
          </div>

          <div>
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Prescription"}
          </button>
        </form>

      </div>

      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <h1>Dispense prescription</h1>
        <h1>{message}</h1>

        <form onSubmit={handleDispense} className="space-y-4">
          <div>
            <label htmlFor="prescriptionID">Prescription ID:</label>
            <input
              id="prescriptionID"
              type="text"
              value={prescriptionID}
              onChange={(e) => setPrescriptionID(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="start_datetime">Start Datetime:</label>
            <input
              id="start_datetime"
              type="datetime-local"
              value={startDatetime}
              onChange={(e) => setStartDatetime(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="frequency">Frequency:</label>
            <input
              id="frequency"
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="dispenseQuantity">Dispense Quantity:</label>
            <input
              id="dispenseQuantity"
              type="number"
              value={dispenseQuantity}
              onChange={(e) => setDispenseQuantity(Number(e.target.value))}
              className="border p-2 w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            {loading ? "Submitting..." : "Submit Dispense"}
          </button>
        </form>

        <div>
          {/* <pre className="bg-gray-100 p-4 rounded-lg">{rawResponse}</pre>{" "} */}
          {/* Display raw response */}
        </div>
      </div>
    </div>
  );
};

export default Page;
