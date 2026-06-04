import { UtensilsCrossed, Info, ShoppingCart } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-orange-600" onClick={() => { navigate('/', { replace: true }) }}>
                    <UtensilsCrossed className="size-6 text-orange-600 animate-pulse" />
                    <span>GourmetGo</span>
                </a>

                {/* Right Side Action Buttons */}
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition" onClick={() => { navigate('/info') }}>
                        <Info className="size-5" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-orange-600 rounded-full hover:bg-orange-50 relative transition" onClick={() => { navigate('/cart') }}>
                        <ShoppingCart className="size-5" />
                    </button>
                </div>
            </div>
        </nav>
    )
}

export const Root = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Premium Sticky Header */}
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};