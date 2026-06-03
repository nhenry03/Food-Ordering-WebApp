export type PaymentMethodType = 'card' | 'cash' | 'phone';

export interface IPaymentMethod {
    id: PaymentMethodType;
    name: string;
};

export const PAYMENT_METHODS: IPaymentMethod[] = [
    { id: 'card', name: 'Credit / Debit Card' },
    { id: 'cash', name: 'Cash at counter' },
    { id: 'phone', name: 'Pay by phone' },
];