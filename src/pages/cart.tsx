import { useDataProvider } from "../components/data-provider";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
    const { lines, updateLine, removeLine } = useDataProvider();
    const navigate = useNavigate();

    const handleQuantityChange = (index: number, delta: number) => {
        const line = lines[index];
        const newQuantity = line.quantity + delta;
        if (newQuantity <= 0) {
            removeLine(index);
        } else {
            updateLine(index, { ...line, quantity: newQuantity });
        }
    };

    const total = lines.reduce((acc, line) => {
        const variantsTotal = line.value?.reduce((sum, v) => sum + (v.price || 0), 0) || 0;
        return acc + (line.price + variantsTotal) * line.quantity;
    }, 0);

    if (lines.length === 0) {
        return (
            <div className="w-full min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Your Cart is Empty</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-64px)] bg-background flex justify-center p-4 sm:p-8 md:py-12 font-sans">
            <div className="w-full max-w-2xl flex flex-col bg-background">

                {/* Line Items */}
                <div className="flex-grow flex flex-col gap-6 mb-8 mt-4">
                    {lines.map((line, index) => (
                        <div key={index} className="flex flex-col border-b border-border/60 pb-6 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex gap-4 items-center">
                                    {/* Inline Quantity Stepper for Edit */}
                                    <div className="flex items-center gap-2 bg-muted/30 rounded-md p-1 border border-border/50">
                                        <button
                                            onClick={() => handleQuantityChange(index, -1)}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-white text-muted-foreground hover:text-foreground shadow-sm hover:shadow transition-all"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold text-foreground text-sm w-4 text-center">{line.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(index, 1)}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-white text-primary font-medium shadow-sm hover:shadow transition-all"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="font-bold text-foreground text-lg tracking-wide">{line.label}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-medium text-foreground text-lg">${(line.price * line.quantity).toFixed(2)}</span>
                                    <div className="flex items-center gap-3 -mr-2">
                                        <button
                                            onClick={() => navigate(`/item/${line.itemId}?edit=${index}`)}
                                            className="px-3 py-1 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold rounded-full transition-colors border border-border/50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => removeLine(index)}
                                            className="text-muted-foreground/50 hover:text-destructive transition-colors"
                                            title="Remove item"
                                        >
                                            <svg className="w-6 h-6 font-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Variants */}
                            {line.value && line.value.length > 0 && (
                                <div className="flex flex-col gap-1.5 ml-8 text-[15px] text-foreground/80 mt-1">
                                    {line.value.map((val, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span><span className="italic">{val.variant}:</span> {val.value}</span>
                                            {val.price > 0 && (
                                                <span>+${(val.price * line.quantity).toFixed(2)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Special Instructions */}
                            {line.instruction && (
                                <div className="ml-8 mt-2.5 text-[15px] text-foreground/80">
                                    <span className="italic">Instructions:</span> {line.instruction}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border/80 pt-6 mt-auto">
                    <div className="flex justify-between text-lg text-foreground/90">
                        <span>Total (Included GST)</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full py-4 rounded-md bg-[#C39A4D] text-white font-medium text-lg hover:bg-[#b08b35] transition-colors shadow-sm mt-6"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};