"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, AlertTriangle } from "lucide-react"
import type { Contact } from "@/types/contact"

interface MergeContactsProps {
  contacts: Contact[]
  onMerge: (contactIds: string[]) => void
  onCancel: () => void
}

export function MergeContacts({ contacts, onMerge, onCancel }: MergeContactsProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  // Find potential duplicates based on name similarity and shared phone/email
  const findDuplicates = () => {
    const duplicateGroups: Contact[][] = []
    const processed = new Set<string>()

    contacts.forEach((contact) => {
      if (processed.has(contact.id)) return

      const duplicates = contacts.filter((other) => {
        if (other.id === contact.id || processed.has(other.id)) return false

        // Check for name similarity
        const nameMatch =
          contact.firstName.toLowerCase() === other.firstName.toLowerCase() &&
          contact.lastName.toLowerCase() === other.lastName.toLowerCase()

        // Check for shared phone numbers
        const sharedPhone = contact.phone.some((phone) => other.phone.some((otherPhone) => phone === otherPhone))

        // Check for shared email addresses
        const sharedEmail = contact.email.some((email) =>
          other.email.some((otherEmail) => email.toLowerCase() === otherEmail.toLowerCase()),
        )

        return nameMatch || sharedPhone || sharedEmail
      })

      if (duplicates.length > 0) {
        const group = [contact, ...duplicates]
        duplicateGroups.push(group)
        group.forEach((c) => processed.add(c.id))
      }
    })

    return duplicateGroups
  }

  const duplicateGroups = findDuplicates()

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleContactSelect = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts((prev) => [...prev, contactId])
    } else {
      setSelectedContacts((prev) => prev.filter((id) => id !== contactId))
    }
  }

  const handleMergeSelected = () => {
    if (selectedContacts.length >= 2) {
      onMerge(selectedContacts)
    }
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onCancel} className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-black rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Merge Duplicate Contacts</CardTitle>
              <CardDescription className="text-gray-500">
                Select contacts to merge together. The first selected contact will be kept as the primary.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {duplicateGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto mb-6">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No Duplicates Found</h3>
            <p className="text-gray-500">Great! No potential duplicate contacts were detected.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">
                  {duplicateGroups.length} potential duplicate group{duplicateGroups.length !== 1 ? "s" : ""} found
                </p>
                <p className="text-yellow-700 mt-1">
                  Review and select contacts to merge. Data from all selected contacts will be combined.
                </p>
              </div>
            </div>

            {duplicateGroups.map((group, groupIndex) => (
              <Card key={groupIndex} className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-gray-900">Duplicate Group {groupIndex + 1}</CardTitle>
                  <CardDescription className="text-gray-500">These contacts appear to be duplicates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {group.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                          selectedContacts.includes(contact.id)
                            ? "border-black bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={(checked) => handleContactSelect(contact.id, checked as boolean)}
                        />
                        <Avatar>
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-black text-white">
                            {getInitials(contact.firstName, contact.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </h4>
                          {contact.company && <p className="text-sm text-gray-500">{contact.company}</p>}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {contact.phone.map((phone, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-gray-200">
                                {phone}
                              </Badge>
                            ))}
                            {contact.email.map((email, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                {email}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex space-x-4 pt-4">
              <Button
                onClick={handleMergeSelected}
                disabled={selectedContacts.length < 2}
                className="flex-1 bg-black hover:bg-gray-800"
              >
                Merge {selectedContacts.length} Selected Contacts
              </Button>
              <Button variant="outline" onClick={onCancel} className="border-gray-200 bg-transparent">
                Cancel
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
