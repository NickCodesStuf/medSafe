"use client"

<<<<<<< HEAD
import React, { useState } from "react"
import { User, Shield, Lock } from "lucide-react"
=======
export default function Register() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [permission, setPermission] = useState(""); // New parameter
  const [response, setResponse] = useState("");
>>>>>>> 591c43d2c28726ec91a84234c5ce3b5dbb2a4359

export default function LoginRegister() {
  const [action, setAction] = useState("Login")
  const [name, setName] = useState("")
  const [permission, setPermission] = useState("")
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState("")

  const handleSubmit = async () => {
    try {
      const endpoint = action === "Login" ? "/login" : "/register"
      const body = JSON.stringify({ name, password, permission })

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
<<<<<<< HEAD
        body: body,
      })
=======
        body: JSON.stringify({ username, password, permission }),
      });
      console.log(JSON.stringify({ username, password, permission }));
>>>>>>> 591c43d2c28726ec91a84234c5ce3b5dbb2a4359

      if (!res.ok) {
        throw new Error(`${action} failed`)
      }

      const result = await res.json()
      setResponse(result.message || `${action} successful`)
    } catch (error) {
      console.error("Error:", error)
      setResponse(`${action} failed`)
    }
  }

  return (
<<<<<<< HEAD
    <div className="container">
      <style jsx>{`
        .container{
          display: flex;
          flex-direction: column;
          margin: auto;
          margin-top: 200px;
          width: 600px;
          background-color: #fff;
          padding-bottom: 30px;
          border-radius: 25px;
        }
        .header{
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          width: 100%;
          margin-top: 30px;
        }
        .text{
          color: seagreen;
          font-size: 48px;
          font-weight: 700;
        }
        .underline{
          width: 61px;
          height: 6px;
          background: seagreen;
          border-radius: 9px;
        }
        .inputs{
          margin-top: 55px;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .input{
          display: flex;
          align-items: center;
          margin: auto;
          padding-left: 23px;
          width: 480px;
          height: 80px;
          background: #eaeaea;
          border-radius: 6px;
        }
        .input svg{
          margin: 0px 30px;
        }
        .input input{
          height: 50px;
          width: 400px;
          padding-left: 10px;
          background: transparent;
          border: none;
          outline: none;
          color: #797979;
          font-size: 19px;
        }
        .forgot-password{
          padding-left: 62px;
          margin-top: 27px;
          color: #797979;
          font-size: 18px;
        }
        .forgot-password span{
          color: rgb(81, 146, 109);
          cursor: pointer;
        }
        .submit-container{
          display: flex;
          gap: 30px;
          margin: 60px;
        }
        .submit{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 220px;
          height: 59px;
          color: #fff;
          background: seagreen;
          border-radius: 50px;
          font-size: 19px;
          font-weight: 700;
          cursor: pointer;
        }
        .gray{
          background: #EAEAEA;
          color: #676767;
        }
        .response{
          text-align: center;
          color: #676767;
          font-size: 14px;
          margin-top: 20px;
        }
      `}</style>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
=======
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none"
        />
        <input
          type="text"
          placeholder="Permission (e.g., admin, user)"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </button>
        {response && (
          <p className="mt-4 text-center text-sm text-gray-600">{response}</p>
        )}
>>>>>>> 591c43d2c28726ec91a84234c5ce3b5dbb2a4359
      </div>
      <div className="inputs">
        <div className="input">
          <User size={24} />
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {action === "Sign Up" && (
          <div className="input">
            <Shield size={24} />
            <input
              type="text"
              placeholder="Permission (e.g., admin, user)"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            />
          </div>
        )}
        <div className="input">
          <Lock size={24} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      {action === "Login" && (
        <div className="forgot-password">
          Forgot Password? <span>Click Here!</span>
        </div>
      )}
      <div className="submit-container">
        <div
          className={action === "Sign Up" ? "submit" : "submit gray"}
          onClick={() => {
            if (action === "Sign Up") {
              handleSubmit()
            } else {
              setAction("Sign Up")
            }
          }}
        >
          Sign Up
        </div>
        <div
          className={action === "Login" ? "submit" : "submit gray"} 
          onClick={() => {
            if (action === "Login") {
              handleSubmit()
            } else {
              setAction("Login")
            }
          }}
        >
          Login
        </div>
      </div>
      {response && <p className="response">{response}</p>}
    </div>
  )
}

