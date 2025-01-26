"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import LoginRegister from "./register/page"
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <img src="../images/medsafe.png" alt="" className="contrast-480 w-40" />
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/about">About</Link>
              <Link href="/products">Products</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-teal-600 text-white shadow hover:bg-teal-700 h-9 px-4 py-2 ml-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Get Started
          </button>
        </div>
      </header>
      <main className={`flex-1 ${isModalOpen ? "blur-sm" : ""}`}>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            The Future of  <span className="text-teal-600">Pharmacy</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Empowering innovation with cutting-edge solutions to the prescription overuse
          </p>
              </div>
              <div className="space-x-4">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-teal-600 text-white shadow hover:bg-teal-700 h-9 px-4 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          <Link
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            href="#"
          >
            Learn More
          </Link>
              </div>
            </div>
          </div>
          <img src="../images/medsafe cad.png" alt="" className="" />
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Innovative Solutions",
                "24/7 Support",
                "Scalable Infrastructure",
                "Data-Driven Insights",
                "Seamless Integration",
                "Robust Security",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <CheckCircle className="w-8 h-8 text-teal-600" />
                  <h3 className="text-xl font-bold">{feature}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2023 ACME Inc. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link className="text-sm hover:underline underline-offset-4" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm hover:underline underline-offset-4" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
      <LoginRegister isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

