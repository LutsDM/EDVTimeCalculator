export interface Order {
    id: number
    createdAt: string
    name: string
    phone: string
    zipCode: string
    street: string
    houseNumber: string
    city: string
    email?: string
    description?: string
    status: "draft" | "in_progress" | "completed"
};

export interface WorkEntryInput {
    worktime: number
    drivetime?: number
    price: number
    employeeId: number
}

export interface WorkEntryComputed {
    id: number
    createdAt: string
    orderId: number

    totalWorkTime: number
    totalDriveTime?: number

    totalPrice: number
}

export interface WorkEntry {
    input: WorkEntryInput
    computed: WorkEntryComputed
}

export interface Employee {
    id: number
    firstName: string
    secondName: string
    phone: string
    email: string
}

