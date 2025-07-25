"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, Building, MapPin, Download, ExternalLink, Smartphone } from "lucide-react"

interface SharedContact {
  firstName: string
  lastName: string
  phone: string[]
  email: string[]
  company?: string
  address?: string
}

export default function SharedContactPage() {
  const searchParams = useSearchParams()
  const [contact, setContact] = useState<SharedContact | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        const contactData = JSON.parse(decodeURIComponent(data))
        setContact(contactData)
      } catch (err) {
        setError("Invalid contact data")
      }
    } else {
      setError("No contact data provided")
    }
  }, [searchParams])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const downloadVCard = () => {
    if (!contact) return

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
${contact.company ? `ORG:${contact.company}` : ""}
${contact.phone.map((phone) => `TEL:${phone}`).join("\n")}
${contact.email.map((email) => `EMAIL:${email}`).join("\n")}
${contact.address ? `ADR:;;${contact.address.replace(/\n/g, " ")};;;;` : ""}
END:VCARD`

    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${contact.firstName}_${contact.lastName}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, "_self")
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gray-200 shadow-sm">
          <CardContent className="text-center py-12">
            <div className="p-3 bg-red-50 rounded-lg w-fit mx-auto mb-4">
              <ExternalLink className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="font-semibold text-gray-900 mb-2">Error Loading Contact</h2>
            <p className="text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gray-200 shadow-sm">
          <CardContent className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading contact...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-black text-white text-xl font-medium">
                  {getInitials(contact.firstName, contact.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {contact.firstName} {contact.lastName}
                </CardTitle>
                {contact.company && (
                  <CardDescription className="text-gray-500 flex items-center space-x-2 mt-1">
                    <Building className="h-4 w-4" />
                    <span>{contact.company}</span>
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Phone Numbers */}
            {contact.phone.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Phone Numbers</h3>
                </div>
                <div className="space-y-3 ml-9">
                  {contact.phone.map((phone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="font-mono text-gray-900">{phone}</span>
                      <Button size="sm" onClick={() => handlePhoneCall(phone)} className="bg-black hover:bg-gray-800">
                        <Smartphone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Addresses */}
            {contact.email.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Email Addresses</h3>
                </div>
                <div className="space-y-3 ml-9">
                  {contact.email.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-900">{email}</span>
                      <Button size="sm" onClick={() => handleEmail(email)} className="bg-black hover:bg-gray-800">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            {contact.address && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                </div>
                <div className="ml-9">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{contact.address}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <Button onClick={downloadVCard} className="w-full bg-black hover:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                Download Contact (.vcf)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
