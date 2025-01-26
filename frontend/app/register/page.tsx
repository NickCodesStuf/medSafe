"use client"

import React, { useState } from "react"
import { User, Shield, Lock } from "lucide-react"
import Cookies from "js-cookie"
import { motion } from "framer-motion"

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const scaleIn = {
  initial: { scale: 0.9 },
  animate: { scale: 1 },
  exit: { scale: 0.9 },
}

interface LoginRegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginRegisterModal({ isOpen, onClose }: LoginRegisterModalProps) {
  const [action, setAction] = useState("Sign Up")
  const [username, setUsername] = useState("")
  const [permission, setPermission] = useState("")
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState("")

  const handleSubmit = async () => {
    try {
      const endpoint = action === "Login" ? "/login" : "/register"
      const body =
        action === "Login" ? JSON.stringify({ username, password }) : JSON.stringify({ username, password, permission })

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `${action} failed`)
      }
      const result = await res.json()
      setResponse(result.message || `${action} successful`)

      if (action === "Login" && result.token) {
        Cookies.set("token", result.token, { expires: 1, secure: false }) // Expires in 1 day
        window.location.href = "/admin-dashboard"
      }
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof Error) {
        setResponse(error.message || `${action} failed`)
      } else {
        setResponse(`${action} failed`)
      }
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        variants={scaleIn}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-4xl font-bold text-teal-600 mb-2"
          >
            {action}
          </motion.h1>
          <div className="w-16 h-1 bg-teal-600 mx-auto rounded-full"></div>
        </div>
        <div className="space-y-6">
          <motion.div
            variants={fadeIn}
            className="flex items-center bg-gray-100 rounded-lg p-3 transition-all duration-300 ease-in-out hover:bg-gray-200"
          >
            <User className="text-teal-600 mr-3" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent text-gray-800 placeholder-gray-500 flex-1 outline-none"
            />
          </motion.div>
          {action === "Sign Up" && (
            <motion.div
              variants={fadeIn}
              className="flex items-center bg-gray-100 rounded-lg p-3 transition-all duration-300 ease-in-out hover:bg-gray-200"
            >
              <Shield className="text-teal-600 mr-3" />
              <input
                type="text"
                placeholder="Email"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="bg-transparent text-gray-800 placeholder-gray-500 flex-1 outline-none"
              />
            </motion.div>
          )}
          <motion.div
            variants={fadeIn}
            className="flex items-center bg-gray-100 rounded-lg p-3 transition-all duration-300 ease-in-out hover:bg-gray-200"
          >
            <Lock className="text-teal-600 mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-gray-800 placeholder-gray-500 flex-1 outline-none"
            />
          </motion.div>
        </div>
        {action === "Login" && (
          <div className="text-gray-600 text-sm mt-4 text-center">
            Forgot Password? <span className="text-teal-600 underline cursor-pointer">Click Here!</span>
          </div>
        )}
        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
              action === "Sign Up" ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => {
              if (action === "Sign Up") {
                handleSubmit()
              } else {
                setAction("Sign Up")
              }
            }}
          >
            Sign Up
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
              action === "Login" ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => {
              if (action === "Login") {
                handleSubmit()
              } else {
                setAction("Login")
              }
            }}
          >
            Login
          </motion.button>
        </div>
        {response && (
          <motion.p
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center mt-4 text-sm text-gray-600"
          >
            {response}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

