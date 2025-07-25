"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, ArrowLeft, User } from "lucide-react"
import type { Contact } from "@/types/contact"

interface ContactFormProps {
  contact?: Contact | null
  onSave: (contact: Omit<Contact, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function ContactForm({ contact, onSave, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: contact?.firstName || "",
    lastName: contact?.lastName || "",
    company: contact?.company || "",
    phone: contact?.phone || [""],
    email: contact?.email || [""],
    address: contact?.address || "",
    notes: contact?.notes || "",
    avatar: contact?.avatar || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedData = {
      ...formData,
      phone: formData.phone.filter((p) => p.trim() !== ""),
      email: formData.email.filter((e) => e.trim() !== ""),
    }

    onSave(cleanedData)
  }

  const addPhoneField = () => {
    setFormData((prev) => ({
      ...prev,
      phone: [...prev.phone, ""],
    }))
  }

  const removePhoneField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      phone: prev.phone.filter((_, i) => i !== index),
    }))
  }

  const updatePhoneField = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: prev.phone.map((phone, i) => (i === index ? value : phone)),
    }))
  }

  const addEmailField = () => {
    setFormData((prev) => ({
      ...prev,
      email: [...prev.email, ""],
    }))
  }

  const removeEmailField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      email: prev.email.filter((_, i) => i !== index),
    }))
  }

  const updateEmailField = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      email: prev.email.map((email, i) => (i === index ? value : email)),
    }))
  }

  return (
    <Card className="apple-card overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{contact ? "Edit Contact" : "New Contact"}</h1>
              <p className="text-sm text-gray-500">{contact ? "Update contact information" : "Add a new contact"}</p>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                  className="apple-input"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                  className="apple-input"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                className="apple-input"
                placeholder="Enter company name"
              />
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Phone Numbers</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addPhoneField}
                className="apple-button-secondary"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {formData.phone.map((phone, index) => (
                <div key={index} className="flex space-x-3">
                  <Input
                    value={phone}
                    onChange={(e) => updatePhoneField(index, e.target.value)}
                    placeholder="Enter phone number"
                    type="tel"
                    className="apple-input"
                  />
                  {formData.phone.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhoneField(index)}
                      className="rounded-full hover:bg-red-50 hover:text-red-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Email Addresses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Email Addresses</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addEmailField}
                className="apple-button-secondary"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {formData.email.map((email, index) => (
                <div key={index} className="flex space-x-3">
                  <Input
                    value={email}
                    onChange={(e) => updateEmailField(index, e.target.value)}
                    placeholder="Enter email address"
                    type="email"
                    className="apple-input"
                  />
                  {formData.email.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEmailField(index)}
                      className="rounded-full hover:bg-red-50 hover:text-red-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
                rows={3}
                className="apple-input resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes"
                rows={4}
                className="apple-input resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <Button type="submit" className="apple-button-primary flex-1">
              {contact ? "Update Contact" : "Add Contact"}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel} className="apple-button-secondary">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
