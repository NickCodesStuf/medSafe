"use client"

import React, { useState } from "react"
import { User, Shield, Lock } from "lucide-react"

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
        body: body,
      })

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

