import { useDataProvider } from "../components/data-provider";
import { MapPin, Phone, Clock } from "lucide-react";

export const Info = () => {
    const { restaurantInfo } = useDataProvider();

    if (!restaurantInfo) {
        return null;
    }

    const formatTime = (time: any) => {
        if (!time) return '';
        if (typeof time === 'string') return time;
        if (time.seconds) {
            return new Date(time.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return String(time);
    };

    return (
        <div className="w-full min-h-screen bg-white font-sans pb-0">
            {/* Hero Section */}
            <div
                className="relative w-full h-[450px] bg-cover bg-center flex flex-col justify-center items-center text-white"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000')" }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content */}
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{restaurantInfo.name}</h1>
                    <p className="text-sm md:text-base font-medium mb-8 text-white/90">A symphony of taste, crafted with passion.</p>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="max-w-[1000px] mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">Our Story</h2>
                        <div className="text-[#666666] text-[15px] leading-relaxed flex flex-col gap-5">
                            <p>
                                At {restaurantInfo.name}, we believe that dining is more than just a meal; it is an immersive experience. Founded on a deep respect for culinary traditions and a relentless pursuit of innovation, our kitchen is a canvas where locally sourced, seasonal ingredients are transformed into masterpieces.
                            </p>
                            <p>
                                Every dish is a testament to our commitment to excellence, designed to evoke emotion and create lasting memories. We invite you to join us on a journey of flavor, where the essence of nature meets the art of gastronomy.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="w-full h-[340px] rounded-[14px] overflow-hidden shadow-sm">
                            <img
                                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
                                alt="Chef plating a dish"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Cards Section */}
            <div className="bg-[#FAFAFA] py-16 border-t border-[#EBEBEB]">
                <div className="max-w-[850px] mx-auto px-6">
                    
                    {/* Location, Contact & Hours Card */}
                    <div className="bg-white rounded-[14px] shadow-sm border border-[#EBEBEB] p-8 flex flex-col md:flex-row gap-10">
                        
                        {/* Map Placeholder */}
                        <div className="w-full md:w-[45%] h-64 md:h-auto bg-[#999999] rounded-[10px] relative flex items-center justify-center overflow-hidden flex-shrink-0">
                            {/* Simple map visual abstraction */}
                            <svg className="absolute inset-0 w-full h-full text-white/30" xmlns="http://www.w3.org/2000/svg">
                                <pattern id="mapPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                                    <path d="M 60 0 L 0 60 M 0 0 L 60 60 M 30 0 L 30 60 M 0 30 L 60 30" fill="none" stroke="currentColor" strokeWidth="2" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#mapPattern)" />
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <MapPin className="text-white w-14 h-14 relative z-10 drop-shadow-md" fill="#666666" />
                        </div>

                        {/* Details */}
                        <div className="w-full md:w-[55%] flex flex-col justify-center">
                            <h3 className="text-[22px] font-bold text-[#1A1A1A] mb-8">Location & Hours</h3>
                            
                            <div className="flex flex-col gap-6 text-[#666666] text-[15px]">
                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FAFAFA] flex items-center justify-center flex-shrink-0 border border-[#EBEBEB]">
                                        <MapPin className="w-4 h-4 text-[#B43E1C]" />
                                    </div>
                                    <span className="leading-relaxed mt-1.5 font-medium">
                                        {restaurantInfo.address.split(',').map((part: string, i: number) => (
                                            <span key={i}>
                                                {part.trim()}
                                                {i !== restaurantInfo.address.split(',').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                                
                                {/* Phone */}
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FAFAFA] flex items-center justify-center flex-shrink-0 border border-[#EBEBEB]">
                                        <Phone className="w-4 h-4 text-[#B43E1C]" />
                                    </div>
                                    <span className="font-medium mt-0.5">{restaurantInfo.phone}</span>
                                </div>

                                <div className="h-px bg-[#F0F0F0] w-full my-1"></div>

                                {/* Hours */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FAFAFA] flex items-center justify-center flex-shrink-0 border border-[#EBEBEB]">
                                        <Clock className="w-4 h-4 text-[#B43E1C]" />
                                    </div>
                                    <div className="flex flex-col mt-0.5 w-full">
                                        <div className="flex justify-between items-center w-full mb-1.5">
                                            <span className="font-semibold text-[#1A1A1A]">Everyday</span>
                                            <span className="text-[#B43E1C] font-semibold bg-[#B43E1C]/10 px-3 py-1 rounded-full text-[13px]">{formatTime(restaurantInfo.openingTime)} - {formatTime(restaurantInfo.closingTime)}</span>
                                        </div>
                                        <p className="text-[13px] text-[#999999]">Kitchen closes 30 minutes prior.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}