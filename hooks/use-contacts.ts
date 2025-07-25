"use client"

import { useState, useEffect } from "react"
import type { Contact } from "@/types/contact"

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load contacts from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContacts = localStorage.getItem("contacts")
      if (savedContacts) {
        try {
          setContacts(JSON.parse(savedContacts))
        } catch (error) {
          console.error("Error loading contacts:", error)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("contacts", JSON.stringify(contacts))
    }
  }, [contacts, isLoaded])

  const addContact = (contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">) => {
    const newContact: Contact = {
      ...contactData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setContacts((prev) => [...prev, newContact])
  }

  const updateContact = (id: string, contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, ...contactData, updatedAt: new Date().toISOString() } : contact,
      ),
    )
  }

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id))
  }

  const mergeContacts = (contactIds: string[]) => {
    if (contactIds.length < 2) return

    const contactsToMerge = contacts.filter((contact) => contactIds.includes(contact.id))
    const primaryContact = contactsToMerge[0]
    const otherContacts = contactsToMerge.slice(1)

    // Merge all data into the primary contact
    const mergedContact: Contact = {
      ...primaryContact,
      phone: [...new Set([...primaryContact.phone, ...otherContacts.flatMap((c) => c.phone)])],
      email: [...new Set([...primaryContact.email, ...otherContacts.flatMap((c) => c.email)])],
      address: primaryContact.address || otherContacts.find((c) => c.address)?.address || "",
      company: primaryContact.company || otherContacts.find((c) => c.company)?.company || "",
      notes: [primaryContact.notes, ...otherContacts.map((c) => c.notes)].filter(Boolean).join("\n\n"),
      updatedAt: new Date().toISOString(),
    }

    // Remove all contacts being merged and add the merged contact
    setContacts((prev) => [...prev.filter((contact) => !contactIds.includes(contact.id)), mergedContact])
  }

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    mergeContacts,
    isLoaded,
  }
}
