export interface Contact {
  id: string
  firstName: string
  lastName: string
  company?: string
  phone: string[]
  email: string[]
  address?: string
  notes?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}
