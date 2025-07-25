"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MessageSquare, Copy, Check, QrCode, Link, Download, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Contact } from "@/types/contact"
import { motion } from "framer-motion"

interface ShareContactProps {
  contact: Contact
  onBack: () => void
}

export function ShareContact({ contact, onBack }: ShareContactProps) {
  const [shareUrl, setShareUrl] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [isGeneratingQR, setIsGeneratingQR] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Generate a shareable URL
    const contactData = encodeURIComponent(
      JSON.stringify({
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        email: contact.email,
        company: contact.company,
        address: contact.address,
      }),
    )
    const url = `${window.location.origin}/contact/shared?data=${contactData}`
    setShareUrl(url)

    // Generate QR code URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&margin=20&data=${encodeURIComponent(url)}`
    setQrCodeUrl(qrUrl)

    setTimeout(() => setIsGeneratingQR(false), 500)
  }, [contact])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const shareViaSMS = () => {
    const message = `Contact: ${contact.firstName} ${contact.lastName}

${contact.phone.length > 0 ? `Phone: ${contact.phone[0]}` : ""}
${contact.email.length > 0 ? `Email: ${contact.email[0]}` : ""}
${contact.company ? `Company: ${contact.company}` : ""}

View full contact: ${shareUrl}`

    const smsUrl = `sms:?body=${encodeURIComponent(message)}`
    window.open(smsUrl, "_self")

    toast({
      title: "SMS App Opening",
      description: "Your SMS app should open with the contact information",
    })
  }

  const generateVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
${contact.company ? `ORG:${contact.company}` : ""}
${contact.phone.map((phone) => `TEL:${phone}`).join("\n")}
${contact.email.map((email) => `EMAIL:${email}`).join("\n")}
${contact.address ? `ADR:;;${contact.address.replace(/\n/g, " ")};;;;` : ""}
${contact.notes ? `NOTE:${contact.notes}` : ""}
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

    toast({
      title: "Download Started",
      description: `${contact.firstName}_${contact.lastName}.vcf downloaded`,
    })
  }

  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${contact.firstName}_${contact.lastName}_QR.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "QR Code Downloaded",
        description: "QR code image saved to your device",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download QR code",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <motion.div
        className="w-full max-w-sm sm:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-100 rounded-full">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
            <div className="flex items-center space-x-3">
              <motion.div
                className="p-2 bg-black rounded-xl"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Share Contact</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Share {contact.firstName} {contact.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 rounded-2xl mb-6 sm:mb-8">
              <TabsTrigger
                value="qr"
                className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 sm:py-3"
              >
                <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">QR</span>
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 sm:py-3"
              >
                <Link className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">URL</span>
              </TabsTrigger>
              <TabsTrigger
                value="sms"
                className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 sm:py-3"
              >
                <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">SMS</span>
              </TabsTrigger>
              <TabsTrigger
                value="vcard"
                className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 sm:py-3"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">vCard</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="space-y-4 sm:space-y-6">
              <div className="text-center space-y-4 sm:space-y-6">
                <motion.div
                  className="flex justify-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-3xl border border-gray-200">
                    {isGeneratingQR ? (
                      <div className="w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center bg-white rounded-2xl">
                        <div className="text-center space-y-2 sm:space-y-3">
                          <motion.div
                            className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-3 border-black border-t-transparent rounded-full mx-auto"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          <p className="text-xs text-gray-600">Generating...</p>
                        </div>
                      </div>
                    ) : (
                      <motion.img
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt="QR Code for contact"
                        className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl mx-auto block"
                        crossOrigin="anonymous"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2 sm:space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Scan to Add Contact</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs sm:max-w-sm mx-auto">
                    Anyone can scan this QR code with their phone camera to instantly view and save the contact
                  </p>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => copyToClipboard(shareUrl)}
                      variant="outline"
                      className="border-gray-200 hover:border-gray-300 rounded-full px-4 sm:px-6 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      ) : (
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      )}
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={downloadQRCode}
                      className="bg-black hover:bg-gray-800 rounded-full px-4 sm:px-6 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Download
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 sm:space-y-6">
              <motion.div
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center space-y-3 sm:space-y-4">
                  <motion.div
                    className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-blue-50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Shareable Link</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Share via email, messaging apps, or social media
                    </p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="share-url" className="text-xs sm:text-sm font-medium text-gray-700">
                    Contact URL
                  </Label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Input
                      id="share-url"
                      value={shareUrl}
                      readOnly
                      className="font-mono text-xs bg-gray-50 border-gray-200 rounded-xl flex-1"
                    />
                    <Button
                      onClick={() => copyToClipboard(shareUrl)}
                      className="bg-black hover:bg-gray-800 rounded-xl px-4 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-amber-800">
                    <strong>Privacy Note:</strong> This link contains contact information and can be accessed by anyone
                    who has it.
                  </p>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4 sm:space-y-6">
              <motion.div
                className="text-center space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-3 sm:space-y-4">
                  <motion.div
                    className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-green-50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Share via Messaging</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Send contact information through SMS
                    </p>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={shareViaSMS}
                    className="bg-black hover:bg-gray-800 w-full rounded-xl py-2 sm:py-3 text-xs sm:text-sm"
                  >
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Open SMS App
                  </Button>
                </motion.div>

                <div className="rounded-2xl bg-blue-50 border border-blue-200 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>How it works:</strong> Your messaging app will open with a pre-formatted message containing
                    the contact details and link.
                  </p>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="vcard" className="space-y-4 sm:space-y-6">
              <motion.div
                className="text-center space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-3 sm:space-y-4">
                  <motion.div
                    className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-purple-50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Download className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Download vCard File</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Standard .vcf file for any contact app
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <motion.div
                      className="text-3xl sm:text-4xl"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      📇
                    </motion.div>
                    <div className="space-y-1 sm:space-y-2">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">
                        {contact.firstName}_{contact.lastName}.vcf
                      </p>
                      <p className="text-xs text-gray-500">Compatible with iPhone, Android, Outlook</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={generateVCard}
                        className="bg-black hover:bg-gray-800 w-full rounded-xl text-xs sm:text-sm"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Download vCard
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
