"use client"

import React from "react"

import { useState } from "react"
import { Building2, Mail, Phone, FileText, Send, CheckCircle } from "lucide-react"

export function AdvertiseForm({ onSuccess }: { onSuccess?: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
  
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ads/inquiries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          contactEmail,
          phone,
          message,
        }),
      }
    )
  
    if (res.ok) {
      setSubmitted(true)
      onSuccess?.()
    } else {
      alert("Failed to send inquiry. Please try again.")
    }
  }
  

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-7 w-7 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">Inquiry Sent!</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you for your interest in advertising with FoodShare. Our admin team will review your request and get back to you shortly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setCompanyName("")
            setContactEmail("")
            setPhone("")
            setMessage("")
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ad-company" className="text-sm font-medium text-foreground">
          Company / Brand Name
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="ad-company"
            type="text"
            required
            placeholder="Your company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-md border border-input bg-card/80 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ad-email" className="text-sm font-medium text-foreground">
          Contact Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="ad-email"
            type="email"
            required
            placeholder="ads@company.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-card/80 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ad-phone" className="text-sm font-medium text-foreground">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="ad-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-input bg-card/80 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ad-message" className="text-sm font-medium text-foreground">
          Tell us about your ad
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <textarea
            id="ad-message"
            required
            rows={3}
            placeholder="Describe the product/service you'd like to advertise..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-md border border-input bg-card/80 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-md bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors"
      >
        <Send className="h-4 w-4" />
        Send Inquiry
      </button>
    </form>
  )
}
