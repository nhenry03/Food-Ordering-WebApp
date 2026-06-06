import { UtensilsCrossed, Info, ShoppingCart } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="sticky top-0 z-40 w-full border-b border-[#334052] bg-[#151515] text-[#f4f1ea]">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:opacity-90 transition" onClick={() => { navigate('/', { replace: true }) }}>
                    <UtensilsCrossed className="size-6 text-primary" />
                    <span>MoonGate</span>
                </a>

                {/* Right Side Action Buttons */}
                <div className="flex items-center gap-3">
                    <button className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition" onClick={() => { navigate('/info') }}>
                        <Info className="size-5" />
                    </button>
                    <button className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 relative transition" onClick={() => { navigate('/cart') }}>
                        <ShoppingCart className="size-5" />
                    </button>
                </div>
            </div>
        </nav>
    )
}

export const Root = () => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
            {/* Premium Sticky Header */}
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};