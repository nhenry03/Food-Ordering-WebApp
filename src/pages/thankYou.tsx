import { Utensils, Check } from "lucide-react";
import { useDataProvider } from "../components/data-provider";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const ThankyouContent = () => {
    const { order, restaurantInfo } = useDataProvider();

    // Automatically transition from pending to confirmed after 7s (the duration of the filling logo)
    useEffect(() => {
        if (order?.status === 'pending' && (order as any).id) {
            const timer = setTimeout(() => {
                const newPickupTime = new Date(Date.now() + 20 * 60000);
                updateDoc(doc(db, 'order', (order as any).id), {
                    status: 'confirmed',
                    pickupTime: newPickupTime.toTimeString().slice(0, 5)
                });
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [order?.status, (order as any).id]);

    if (!order) return null;

    if (order.status === 'pending') {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-20 px-6 font-sans">

                {/* Logo & 5s Animation */}
                <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="#EBEBEB" strokeWidth="2.5" />
                        {/* Animated Circle (5s) */}
                        <circle
                            cx="50" cy="50" r="48"
                            fill="none"
                            stroke="#B43E1C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{
                                strokeDasharray: 301.6,
                                strokeDashoffset: 301.6,
                                animation: "fillProgress 7s linear forwards"
                            }}
                        />
                    </svg>
                    {/* Inner Logo */}
                    <div className="w-[72px] h-[72px] rounded-full bg-white shadow-sm flex items-center justify-center text-[#B43E1C]">
                        <Utensils className="w-8 h-8" />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl font-bold text-[#0A1128] mb-3 text-center tracking-tight">Preparing your experience</h1>
                <p className="text-[#666666] text-center max-w-sm mb-10 text-[15px] leading-relaxed">
                    The culinary team at <span className="font-semibold text-[#0A1128]">{restaurantInfo?.name || "GourmetGo"}</span> is reviewing your order. We will confirm shortly.
                </p>

                {/* Order Summary Card */}
                <div className="bg-white rounded-[14px] shadow-sm border border-[#EBEBEB] w-full max-w-md p-7">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[11px] font-bold text-[#8A5A44] uppercase tracking-wider mb-1.5">Order Number</p>
                            <h2 className="text-2xl font-bold text-[#1A1A1A]">#{(order as any).id?.substring(0, 8).toUpperCase() || "GG-84920"}</h2>
                        </div>
                        <div className="bg-[#F3EFEA] text-[#8A5A44] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide">
                            Pending
                        </div>
                    </div>

                    <div className="h-px bg-[#F0F0F0] w-full mb-6"></div>

                    {/* Order Items */}
                    <div className="flex flex-col gap-5 mb-6">
                        {order.lines.map((line, idx) => {
                            const variantsTotal = line.value?.reduce((sum, v) => sum + (v.price || 0), 0) || 0;
                            const itemTotal = (line.price + variantsTotal) * line.quantity;
                            const variantsText = line.value?.map(v => v.value).join(" • ");

                            return (
                                <div key={idx} className="flex justify-between items-start">
                                    <div className="pr-4">
                                        <p className="text-[#1A1A1A] font-semibold text-[15px] mb-1 leading-snug">{line.label}</p>
                                        <p className="text-[#666666] text-[12px] font-medium">
                                            Qty: {line.quantity} {variantsText ? ` • ${variantsText}` : ""}
                                        </p>
                                    </div>
                                    <p className="text-[#1A1A1A] font-medium text-[15px] whitespace-nowrap">${itemTotal.toFixed(2)}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="h-px bg-[#F0F0F0] w-full mb-5"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center">
                        <span className="text-[#666666] font-medium text-[15px]">Total</span>
                        <span className="text-[#1A1A1A] font-bold text-xl">${order.total.toFixed(2)}</span>
                    </div>
                </div>

                <style>{`
                    @keyframes fillProgress {
                        0% { stroke-dashoffset: 301.6; }
                        100% { stroke-dashoffset: 0; }
                    }
                `}</style>
            </div>
        );
    }

    if (order.status === 'confirmed') {
        const orderIdText = (order as any).id?.substring(0, 8).toUpperCase() || "GG-84729-XT";

        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-20 px-6 font-sans pb-24">
                {/* Check Logo */}
                <div className="w-[72px] h-[72px] rounded-full bg-[#F05123] flex items-center justify-center text-white mb-6 shadow-sm">
                    <Check className="w-10 h-10" strokeWidth={3} />
                </div>

                {/* Text Content */}
                <h1 className="text-[32px] font-bold text-[#0A1128] mb-3 text-center tracking-tight">Order Confirmed</h1>
                <p className="text-[#666666] text-center max-w-lg mb-6 text-[15px] leading-relaxed">
                    Thank you for choosing {restaurantInfo?.name || "GourmetGo"}. Your culinary experience is being prepared.
                </p>

                <h2 className="text-[22px] font-bold text-[#A33A1F] mb-1.5 tracking-tight">
                    Estimated Pickup: {order.pickupTime}
                </h2>
                <p className="text-[13px] text-[#666666] mb-10 font-medium">Order #{orderIdText}</p>

                {/* Cards Container */}
                <div className="w-full max-w-[850px] mx-auto flex flex-col md:flex-row gap-6 items-start">

                    {/* Left Card - Order Details */}
                    <div className="bg-white rounded-[14px] shadow-sm border border-[#EBEBEB] w-full md:flex-grow p-7">
                        <h3 className="text-xl font-bold text-[#0A1128] mb-5 tracking-tight">Order Details</h3>
                        <div className="h-px bg-[#F0F0F0] w-full mb-6"></div>

                        <div className="flex flex-col gap-6">
                            {order.lines.map((line, idx) => {
                                const variantsTotal = line.value?.reduce((sum, v) => sum + (v.price || 0), 0) || 0;
                                const itemTotal = (line.price + variantsTotal) * line.quantity;
                                const variantsText = line.value?.map(v => v.value).join(", ");

                                return (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="w-20 h-20 rounded-xl bg-[#F5F5F5] flex-shrink-0 overflow-hidden border border-[#EBEBEB]">
                                            <img src={(line as any).image?.src || `https://ui-avatars.com/api/?name=${encodeURIComponent(line.label)}&background=random&color=fff&size=200`} alt={line.label} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow pt-0.5">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-[#0A1128] font-bold text-[15px] leading-snug">{line.label}</p>
                                                <p className="text-[#0A1128] font-bold text-[15px] whitespace-nowrap">${itemTotal.toFixed(2)}</p>
                                            </div>
                                            {variantsText && (
                                                <p className="text-[#A33A1F] text-[12px] font-medium mb-1.5">
                                                    Variant: {variantsText}
                                                </p>
                                            )}
                                            <p className="text-[#666666] text-[12px] font-medium">
                                                Qty: {line.quantity}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    return null;
}

export const ThankYou = () => {
    return (
        <ThankyouContent />
    );
}