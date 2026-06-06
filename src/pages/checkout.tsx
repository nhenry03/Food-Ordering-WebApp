import { useState } from "react";
import { useDataProvider } from "../components/data-provider";
import { useNavigate } from "react-router-dom";
import { IOrder } from "models";

export const Checkout = () => {
    const { lines, checkout } = useDataProvider();
    const navigate = useNavigate();

    const [openSteps, setOpenSteps] = useState<number[]>([1]);

    const toggleStep = (step: number) => {
        setOpenSteps(prev =>
            prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
        );
    };

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "phone">("card");
    const [comments, setComments] = useState("");

    // Calculations
    const total = lines.reduce((acc, line) => {
        const variantsTotal = line.value?.reduce((sum, v) => sum + (v.price || 0), 0) || 0;
        return acc + (line.price + variantsTotal) * line.quantity;
    }, 0);

    const onSubmit = (data: IOrder) => checkout(data);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (lines.length === 0) {
            return;
        }

        try {
            await onSubmit({
                firstName,
                lastName,
                email,
                phone,
                lines,
                comment: comments,
                pickupTime: "", // Server will set the actual time
                paymentMethod: [paymentMethod],
                subTotal: total,
                total: total
            });
            alert("Order placed successfully!");
            navigate("/thankYou");
        } catch (e) {
            console.error("Failed to place order:", e);
            alert("There was an error placing your order. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans pt-12 pb-24">
            <div className="max-w-[1100px] mx-auto px-6">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2 tracking-tight">Checkout</h1>
                    <p className="text-[#666666] text-sm">Please complete your details to finalize your order.</p>
                </div>

                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Left Column - Steps */}
                    <div className="w-full lg:flex-grow flex flex-col gap-4">

                        {/* Step 1: Contact Information */}
                        <div className={`bg-white rounded-xl border border-[#EBEBEB] overflow-hidden transition-all duration-300 ${openSteps.includes(1) ? 'shadow-sm' : ''}`}>
                            <div
                                className="px-6 py-5 flex items-center justify-between cursor-pointer"
                                onClick={() => toggleStep(1)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${openSteps.includes(1) ? 'bg-[#FDECE8] text-[#B43E1C]' : 'bg-[#F0F0F0] text-[#666666]'}`}>
                                        1
                                    </div>
                                    <h2 className="text-[19px] font-bold text-[#1A1A1A]">Contact Information</h2>
                                </div>
                                <svg className={`w-5 h-5 text-[#666666] transition-transform duration-300 ${openSteps.includes(1) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {openSteps.includes(1) && (
                                <div className="px-6 pb-6 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-[#666666]">First Name</label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Jane"
                                                required
                                                className="w-full px-4 py-3 rounded-md border border-[#EBEBEB] bg-[#FAFAFA] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#B43E1C] focus:ring-1 focus:ring-[#B43E1C] transition-colors"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-[#666666]">Last Name</label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Doe"
                                                required
                                                className="w-full px-4 py-3 rounded-md border border-[#EBEBEB] bg-[#FAFAFA] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#B43E1C] focus:ring-1 focus:ring-[#B43E1C] transition-colors"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-[#666666]">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="jane@example.com"
                                                required
                                                className="w-full px-4 py-3 rounded-md border border-[#EBEBEB] bg-[#FAFAFA] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#B43E1C] focus:ring-1 focus:ring-[#B43E1C] transition-colors"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-[#666666]">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="(555) 123-4567"
                                                required
                                                pattern="^[\d\s\-\+\(\)]{7,}$"
                                                title="Please enter a valid phone number with at least 7 digits."
                                                className="w-full px-4 py-3 rounded-md border border-[#EBEBEB] bg-[#FAFAFA] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#B43E1C] focus:ring-1 focus:ring-[#B43E1C] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment Method */}
                        <div className={`bg-white rounded-xl border border-[#EBEBEB] overflow-hidden transition-all duration-300 ${openSteps.includes(2) ? 'shadow-sm' : ''}`}>
                            <div
                                className="px-6 py-5 flex items-center justify-between cursor-pointer"
                                onClick={() => toggleStep(2)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${openSteps.includes(2) ? 'bg-[#FDECE8] text-[#B43E1C]' : 'bg-[#F0F0F0] text-[#666666]'}`}>
                                        2
                                    </div>
                                    <h2 className="text-[19px] font-bold text-[#1A1A1A]">Payment Method</h2>
                                </div>
                                <svg className={`w-5 h-5 text-[#666666] transition-transform duration-300 ${openSteps.includes(2) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {openSteps.includes(2) && (
                                <div className="px-6 pb-6 pt-2">
                                    <div className="flex flex-col gap-4 mb-6">

                                        <label className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#B43E1C] bg-[#FDECE8]/30' : 'border-[#EBEBEB] hover:border-[#B43E1C]/50'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${paymentMethod === 'card' ? 'border-[#B43E1C]' : 'border-[#CCCCCC]'}`}>
                                                {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#B43E1C]" />}
                                            </div>
                                            <span className="font-medium text-[#1A1A1A] text-sm">Credit / Debit Card</span>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="card"
                                                checked={paymentMethod === 'card'}
                                                onChange={() => setPaymentMethod('card')}
                                                className="hidden"
                                            />
                                        </label>

                                        <label className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-[#B43E1C] bg-[#FDECE8]/30' : 'border-[#EBEBEB] hover:border-[#B43E1C]/50'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${paymentMethod === 'cash' ? 'border-[#B43E1C]' : 'border-[#CCCCCC]'}`}>
                                                {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-[#B43E1C]" />}
                                            </div>
                                            <span className="font-medium text-[#1A1A1A] text-sm">Cash</span>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cash"
                                                checked={paymentMethod === 'cash'}
                                                onChange={() => setPaymentMethod('cash')}
                                                className="hidden"
                                            />
                                        </label>

                                        <label className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${paymentMethod === 'phone' ? 'border-[#B43E1C] bg-[#FDECE8]/30' : 'border-[#EBEBEB] hover:border-[#B43E1C]/50'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${paymentMethod === 'phone' ? 'border-[#B43E1C]' : 'border-[#CCCCCC]'}`}>
                                                {paymentMethod === 'phone' && <div className="w-2.5 h-2.5 rounded-full bg-[#B43E1C]" />}
                                            </div>
                                            <span className="font-medium text-[#1A1A1A] text-sm">Pay by Phone</span>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="phone"
                                                checked={paymentMethod === 'phone'}
                                                onChange={() => setPaymentMethod('phone')}
                                                className="hidden"
                                            />
                                        </label>

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Order Comments */}
                        <div className={`bg-white rounded-xl border border-[#EBEBEB] overflow-hidden transition-all duration-300 ${openSteps.includes(3) ? 'shadow-sm' : ''}`}>
                            <div
                                className="px-6 py-5 flex items-center justify-between cursor-pointer"
                                onClick={() => toggleStep(3)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${openSteps.includes(3) ? 'bg-[#FDECE8] text-[#B43E1C]' : 'bg-[#F0F0F0] text-[#666666]'}`}>
                                        3
                                    </div>
                                    <h2 className="text-[19px] font-bold text-[#1A1A1A]">Order Comments</h2>
                                </div>
                                <svg className={`w-5 h-5 text-[#666666] transition-transform duration-300 ${openSteps.includes(3) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {openSteps.includes(3) && (
                                <div className="px-6 pb-6 pt-2">
                                    <textarea
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="Add any special instructions for the restaurant or driver..."
                                        className="w-full px-4 py-3 rounded-md border border-[#EBEBEB] bg-[#FAFAFA] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#B43E1C] focus:ring-1 focus:ring-[#B43E1C] transition-colors min-h-[120px] resize-none"
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-[380px] flex-shrink-0">
                        <div className="bg-white rounded-xl border border-[#EBEBEB] p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Order Summary</h2>

                            {/* Items List */}
                            <div className="flex flex-col gap-5 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {lines.map((line, index) => {
                                    const variantsTotal = line.value?.reduce((sum, v) => sum + (v.price || 0), 0) || 0;
                                    const itemTotal = (line.price + variantsTotal) * line.quantity;

                                    return (
                                        <div key={index} className="flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-2">
                                                    <span className="font-bold text-[#1A1A1A] text-sm">{line.quantity}x</span>
                                                    <span className="font-bold text-[#1A1A1A] text-sm">{line.label}</span>
                                                </div>
                                                <span className="text-[#1A1A1A] text-sm font-medium">${itemTotal.toFixed(2)}</span>
                                            </div>

                                            {line.value && line.value.length > 0 && (
                                                <div className="flex flex-col ml-6 mt-1 text-xs text-[#666666]">
                                                    {line.value.map((v, i) => (
                                                        <span key={i}>{v.value}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Final Total */}
                            <div className="flex justify-between items-center py-5">
                                <span className="font-bold text-[#1A1A1A] text-lg">Total</span>
                                <span className="font-bold text-[#B43E1C] text-lg">${total.toFixed(2)}</span>
                            </div>

                            {/* Place Order Button */}
                            <button
                                type="submit"
                                disabled={lines.length === 0}
                                className={`w-full py-3.5 rounded-md font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm mb-4 ${lines.length === 0 ? 'bg-[#EBEBEB] text-[#999999] cursor-not-allowed' : 'bg-[#B43E1C] hover:bg-[#9a3518] text-white'}`}
                            >
                                Place Order
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>

                            {lines.length === 0 && (
                                <p className="text-center text-[13px] text-[#B43E1C] font-medium mb-4">
                                    Your cart is empty. Please add items to place an order. <span className="underline" onClick={() => navigate('/')}>Go to Menu</span>
                                </p>
                            )}

                            <p className="text-center text-[11px] text-[#666666] px-4">
                                By placing your order, you agree to our <a href="#" className="underline hover:text-[#1A1A1A]">Terms of Service</a>.
                            </p>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};