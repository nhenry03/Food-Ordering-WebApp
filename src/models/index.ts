export type PaymentMethodType = 'cash' | 'card' | 'phone';

export interface IRestaurant {
    name: string,
    address: string,
    phone: string,
    closingTime: string,
    openingTime: string,
    paymentMethods: PaymentMethodType[],
}

export interface Category {
    id: string,
    createdDate: string,
    lastUpdate: string,
    createdBy: string,
    image: string,
    title: string,
    description: string,
}

export interface IChoice {
    label: string,
    price: number
}

export interface IVariant {
    isRequired: boolean,
    allowedMultiple: boolean,
    type: string,
    choices: IChoice[]
}

export interface Item {
    id: string,
    createdDate: string,
    lastUpdate: string,
    createdBy: string,
    label: string,
    description: string,
    image: string,
    price: number,
    category: string,
    variants: IVariant[]
}

export interface ILineValue {
    variant: string,
    value: string,
    price: number
}

export interface ILine {
    label: string,
    price: number,
    quantity: number,
    instruction: string,
    value: ILineValue[]
}

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface IOrder {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    lines: ILine[],
    comment?: string,
    reason?: string,
    pickupTime: string,
    paymentMethod: PaymentMethodType[],
    status?: OrderStatus[],
    subTotal: number,
    total: number
}