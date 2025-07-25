"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Trash2, Share, Phone, Mail, MapPin, Building, FileText, MessageSquare } from "lucide-react"
import { ShareContact } from "@/components/share-contact"
import type { Contact } from "@/types/contact"

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
}

interface ContactDetailProps {
  contact: Contact
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ContactDetail({ contact, onBack, onEdit, onDelete }: ContactDetailProps) {
  const [showShare, setShowShare] = useState(false)

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handlePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, "_self")
  }

  const handleSMS = (phone: string) => {
    const message = `Hi ${contact.firstName}, `
    window.open(`sms:${phone}?body=${encodeURIComponent(message)}`, "_self")
  }

  const handleShareClick = () => {
    setShowShare(true)
  }

  if (showShare) {
    return <ShareContact contact={contact} onBack={() => setShowShare(false)} />
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <motion.div className="w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
        <Card className="border-gray-200 shadow-xl overflow-hidden bg-white">
          {/* Header with Back Button */}
          <motion.div className="p-3 sm:p-4 border-b border-gray-100" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleShareClick}
                    size="sm"
                    className="bg-black hover:bg-gray-800 rounded-full px-3 sm:px-4 text-xs sm:text-sm"
                  >
                    <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Share
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="hover:bg-gray-100 rounded-full px-3 sm:px-4 text-xs sm:text-sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Edit
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="hover:bg-red-50 hover:text-red-600 rounded-full px-3 sm:px-4 text-xs sm:text-sm"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <CardContent className="p-4 sm:p-6">
            {/* Contact Header */}
            <motion.div className="text-center mb-6" variants={itemVariants}>
              <motion.div
                className="mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto">
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xl sm:text-2xl font-medium">
                    {getInitials(contact.firstName, contact.lastName)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.h1
                className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {contact.firstName} {contact.lastName}
              </motion.h1>
              {contact.company && (
                <motion.p
                  className="text-gray-500 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Building className="h-4 w-4" />
                  <span>{contact.company}</span>
                </motion.p>
              )}
            </motion.div>

            <div className="space-y-5 sm:space-y-6">
              <AnimatePresence>
                {/* Phone Numbers */}
                {contact.phone.length > 0 && (
                  <motion.div className="space-y-3" variants={itemVariants} initial="hidden" animate="visible" layout>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">Phone Numbers</span>
                    </div>
                    <div className="space-y-2">
                      {contact.phone.map((phone, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <span className="font-mono text-gray-900 text-sm sm:text-base">{phone}</span>
                          <div className="flex items-center space-x-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                onClick={() => handlePhoneCall(phone)}
                                className="bg-black hover:bg-gray-800 rounded-full px-3 py-1 text-xs"
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSMS(phone)}
                                className="hover:bg-gray-200 rounded-full px-3 py-1 text-xs"
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                SMS
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Email Addresses */}
                {contact.email.length > 0 && (
                  <motion.div className="space-y-3" variants={itemVariants} initial="hidden" animate="visible" layout>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">Email Addresses</span>
                    </div>
                    <div className="space-y-2">
                      {contact.email.map((email, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <span className="text-gray-900 text-sm break-all">{email}</span>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              onClick={() => handleEmail(email)}
                              className="bg-black hover:bg-gray-800 rounded-full px-3 py-1 text-xs ml-2 flex-shrink-0"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Address */}
                {contact.address && (
                  <motion.div className="space-y-3" variants={itemVariants} initial="hidden" animate="visible" layout>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">Address</span>
                    </div>
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-700 text-sm whitespace-pre-line">{contact.address}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Notes */}
                {contact.notes && (
                  <motion.div className="space-y-3" variants={itemVariants} initial="hidden" animate="visible" layout>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">Notes</span>
                    </div>
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-700 text-sm whitespace-pre-line">{contact.notes}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <motion.div
              className="flex justify-between text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span>
                Created:{" "}
                {new Date(contact.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>
                Updated:{" "}
                {new Date(contact.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
