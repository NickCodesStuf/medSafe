"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

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
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/prescriptions", {
        method: "GET",
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
      setRawResponse("Error fetching data");
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

      const data = await res.text(); // Use .text() to get raw response as string

      if (res.status === 200) {
        // If the status code is 200, it's a success
        setRawResponse(data); // Set the raw response text
        setMessage("Prescription added successfully!");
      } else {
        // If the status code is not 200, show a fail message
        setMessage("Failed to add prescription");
        setRawResponse(data); // Show the raw error message
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("An error occurred while submitting data.");
      setRawResponse("Error submitting data");
    } finally {
      setLoading(false);
    }
  };

  const [prescriptionID, setPrescriptionID] = useState("");
  const [amount, setAmount] = useState(0);
  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("token");
    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    setLoading(true);
    setMessage("Sending data...");

    try {
      const res = await fetch("http://localhost:5000/prescriptions/decrease", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Content-Type header for JSON payload
          Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
        },
        body: JSON.stringify({
          id: prescriptionID,
          amount: amount,
        }),
      });

      const data = await res.text(); // Use .text() to get raw response as string

      if (res.status === 200) {
        // If the status code is 200, it's a success
        setRawResponse(data); // Set the raw response text
        setMessage("Prescription decreased!");
      } else {
        // If the status code is not 200, show a fail message
        setMessage("Failed to decrease prescription");
        setRawResponse(data); // Show the raw error message
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("An error occurred while submitting data.");
      setRawResponse("Error submitting data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <h1>Prescription data: </h1>
        <div>
          <pre className="bg-gray-100 p-4 rounded-lg">{rawResponse}</pre>{" "}
          {/* Display raw response */}
        </div>
        <p>{message}</p>
      </div>



    </div>
  );
};

export default Page;
