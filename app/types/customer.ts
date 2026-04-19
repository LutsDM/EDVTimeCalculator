export type CustomerType = "private" | "company"

export type Customer = {
  type: CustomerType

  firstName: string
  lastName: string

  phone?: string
  mobilePhone?: string

  postalCode: string
  city: string
  street: string
  houseNumber: string

  companyName?: string
}
