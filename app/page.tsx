"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Users, Share, Trash2, Edit, UserPlus, Phone, Mail } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { ContactDetail } from "@/components/contact-detail"
import { MergeContacts } from "@/components/merge-contacts"
import { useContacts } from "@/hooks/use-contacts"
import type { Contact } from "@/types/contact"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.2 },
  },
}

export default function ContactApp() {
  const { contacts, addContact, updateContact, deleteContact, mergeContacts, isLoaded } = useContacts()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showMerge, setShowMerge] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading contacts...</p>
        </div>
      </div>
    )
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.some((email) => email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contact.phone.some((phone) => phone.includes(searchTerm)),
  )

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setShowAddForm(true)
  }

  const handleSaveContact = (contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">) => {
    if (editingContact) {
      updateContact(editingContact.id, contactData)
      setEditingContact(null)
    } else {
      addContact(contactData)
    }
    setShowAddForm(false)
  }

  const handleDeleteContact = (contactId: string) => {
    deleteContact(contactId)
    if (selectedContact?.id === contactId) {
      setSelectedContact(null)
    }
  }

  const handleMergeContacts = (contactIds: string[]) => {
    mergeContacts(contactIds)
    setShowMerge(false)
  }

  if (showAddForm) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-6 py-8 max-w-2xl">
          <ContactForm
            contact={editingContact}
            onSave={handleSaveContact}
            onCancel={() => {
              setShowAddForm(false)
              setEditingContact(null)
            }}
          />
        </div>
      </motion.div>
    )
  }

  if (showMerge) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <MergeContacts contacts={contacts} onMerge={handleMergeContacts} onCancel={() => setShowMerge(false)} />
        </div>
      </motion.div>
    )
  }

  if (selectedContact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ContactDetail
          contact={selectedContact}
          onBack={() => setSelectedContact(null)}
          onEdit={() => handleEditContact(selectedContact)}
          onDelete={() => handleDeleteContact(selectedContact.id)}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="border-b border-gray-200 bg-white"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          {/* Mobile Layout */}
          <div className="block sm:hidden space-y-4">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <motion.div className="p-2 bg-black rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Users className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Contact Manager</h1>
                <p className="text-xs text-gray-500">Manage and share your contacts</p>
              </div>
            </motion.div>

            <motion.div
              className="flex space-x-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={() => setShowMerge(true)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs py-2.5 border-gray-200"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Merge
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="sm"
                  className="w-full bg-black hover:bg-gray-800 text-xs py-2.5"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Contact
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <motion.div className="p-2 bg-black rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Users className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Contact Manager</h1>
                <p className="text-sm text-gray-500">Manage and share your contacts</p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={() => setShowMerge(true)} variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Merge Duplicates
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={() => setShowAddForm(true)} size="sm" className="bg-black hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
          {/* Search */}
          <motion.div className="max-w-md" variants={itemVariants}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 sm:h-10 border-gray-200 focus:border-black focus:ring-black text-base sm:text-sm"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Redesigned Stats */}
          <motion.div className="bg-gray-50 rounded-2xl p-4 sm:p-6" variants={itemVariants}>
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <motion.div
                className="flex items-center justify-center sm:justify-start space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <motion.p
                      className="text-2xl font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {contacts.length}
                    </motion.p>
                    <p className="text-sm text-gray-500">Total Contacts</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center space-x-4"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Search className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <motion.p
                      className="text-2xl font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {filteredContacts.length}
                    </motion.p>
                    <p className="text-sm text-gray-500">Search Results</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center sm:justify-end space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Share className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <motion.p
                      className="text-2xl font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      4
                    </motion.p>
                    <p className="text-sm text-gray-500">Share Methods</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact List */}
          <AnimatePresence mode="wait">
            {filteredContacts.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-sm mx-auto">
                  <motion.div
                    className="p-4 bg-gray-50 rounded-full w-fit mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <Users className="h-8 w-8 text-gray-400" />
                  </motion.div>
                  <motion.h3
                    className="text-lg font-medium text-gray-900 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    No contacts found
                  </motion.h3>
                  <motion.p
                    className="text-gray-500 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first contact"}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={() => setShowAddForm(true)} className="bg-black hover:bg-gray-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredContacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover="hover"
                      layout
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group hover:shadow-md transition-shadow border-gray-200 hover:border-gray-300 cursor-pointer">
                        <CardContent className="p-6" onClick={() => setSelectedContact(contact)}>
                          <div className="flex items-start space-x-4 mb-4">
                            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gray-200 text-gray-700 text-lg font-medium">
                                  {getInitials(contact.firstName, contact.lastName)}
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <motion.h3
                                className="font-medium text-gray-900 truncate"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                {contact.firstName} {contact.lastName}
                              </motion.h3>
                              {contact.company && (
                                <motion.p
                                  className="text-sm text-gray-500 truncate mt-1"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {contact.company}
                                </motion.p>
                              )}
                              <motion.div
                                className="flex items-center space-x-2 mt-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                {contact.phone.length > 0 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {contact.phone.length}
                                  </Badge>
                                )}
                                {contact.email.length > 0 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {contact.email.length}
                                  </Badge>
                                )}
                              </motion.div>
                            </div>
                          </div>

                          <motion.div
                            className="flex items-center justify-between pt-4 border-t border-gray-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                              View Details
                            </Button>
                            <div className="flex space-x-1">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditContact(contact)
                                  }}
                                  className="h-8 w-8 hover:bg-gray-100"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteContact(contact.id)
                                  }}
                                  className="h-8 w-8 hover:bg-gray-100 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
