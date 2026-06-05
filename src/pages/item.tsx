import { useDataProvider } from "../components/data-provider";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/* ── Design tokens from DESIGNITEMPAGE.md ─────────────────────────────── */
const C = {
    background: "var(--background-hex, #141312)",
    surface: "var(--card-hex, #1f1d1b)",
    surfaceLow: "var(--muted-hex, #2b2826)",
    onSurface: "var(--foreground-hex, #fcfbfa)",
    onSurfaceVariant: "var(--muted-foreground-hex, #a89f9d)",
    outline: "var(--border-hex, #423c3a)",
    outlineVariant: "var(--border-hex, #423c3a)",
    primary: "var(--primary-hex, #ff5722)",
    primaryContainer: "var(--primary-hex, #ff5722)",
    onPrimary: "var(--primary-foreground-hex, #ffffff)",
    neutral: "var(--muted-foreground-hex, #a89f9d)",
} as const;

export const Item = () => {
    const { getItemById } = useDataProvider();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const item = getItemById(id!);

    // State: Record<variantType, choiceLabel[]>
    const [selectedChoices, setSelectedChoices] = useState<Record<string, string[]>>({});
    const [quantity, setQuantity] = useState<number>(1);

    // Pre-select first option for single-select variants (unless they only have 1 option)
    useEffect(() => {
        if (item?.variants) {
            const initial: Record<string, string[]> = {};
            item.variants.forEach((variant) => {
                if (!variant.allowedMultiple && variant.choices.length > 1) {
                    initial[variant.type] = [variant.choices[0].label];
                } else {
                    initial[variant.type] = [];
                }
            });
            setSelectedChoices(initial);
        }
    }, [item]);

    if (!item) {
        return (
            <div style={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                fontFamily: "'Inter', sans-serif",
            }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: C.onSurface }}>
                    Item Not Found
                </h2>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "12px 32px",
                        borderRadius: 9999,
                        background: C.primaryContainer,
                        color: C.onPrimary,
                        fontWeight: 600,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    const handleSelectRadio = (variantType: string, choiceLabel: string) => {
        setSelectedChoices((prev) => ({
            ...prev,
            [variantType]: [choiceLabel],
        }));
    };

    const handleToggleCheckbox = (variantType: string, choiceLabel: string) => {
        setSelectedChoices((prev) => {
            const current = prev[variantType] || [];
            const next = current.includes(choiceLabel)
                ? current.filter((c) => c !== choiceLabel)
                : [...current, choiceLabel];
            return { ...prev, [variantType]: next };
        });
    };

    const handleAddToOrder = () => {
        const missingRequired = item.variants?.filter((variant) => {
            if (variant.isRequired) {
                // If the variant only has 1 option/choice, do not force the user to take it
                if (variant.choices.length <= 1) {
                    return false;
                }
                const selections = selectedChoices[variant.type] || [];
                return selections.length === 0;
            }
            return false;
        });

        if (missingRequired && missingRequired.length > 0) {
            alert(`Please make a selection for: ${missingRequired.map((v) => v.type).join(", ")}`);
            return;
        }

        const selectedVariantsPayload = Object.entries(selectedChoices).map(([type, labels]) => {
            const variantObj = item.variants.find((v) => v.type === type);
            const choicesSelected = variantObj?.choices.filter((c) => labels.includes(c.label)) || [];
            return { type, choices: choicesSelected };
        });

        const orderItem = {
            itemId: item.id,
            label: item.label,
            basePrice: item.price,
            quantity,
            variants: selectedVariantsPayload,
        };

        console.log("Adding to order:", orderItem);
        alert(`Added ${quantity}x ${item.label} to order!`);
        navigate("/");
    };

    return (
        <div className="w-full font-sans min-h-[calc(100vh-64px)] flex flex-col justify-between">
            {/* Split Screen Container (connects directly to left and top under navbar) */}
            <div className="flex flex-col md:flex-row w-full flex-grow items-stretch bg-background">
                {/* Left Side: Image Area (up to 60% width on md screens, full bleed) */}
                <div className="md:w-auto md:max-w-[60%] flex-shrink-0 relative overflow-hidden bg-background flex items-center justify-start">
                    {item.image?.src ? (
                        <img
                            src={item.image.src}
                            alt={item.image.title || item.label}
                            className="h-full w-auto object-contain object-left"
                            style={{ maxHeight: "calc(100vh - 64px)" }}
                        />
                    ) : (
                        <div className="w-[450px] h-[450px] flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground font-medium">No Image Available</span>
                        </div>
                    )}
                </div>

                {/* Fixed Spacer (Fixed Distance between image and right side details) */}
                <div className="hidden md:block w-16 flex-shrink-0" />
                <div className="block md:hidden h-8 flex-shrink-0" />

                {/* Right Side: Details & Customization */}
                <div className="flex-grow p-8 sm:p-12 md:py-16 md:pr-16 flex flex-col justify-center bg-background">
                    {/* Title & Price */}
                    <h1 className="font-sans font-bold text-4xl sm:text-5xl text-foreground mb-3 leading-tight tracking-tight">
                        {item.label}
                    </h1>
                    <div className="font-sans font-bold text-2xl text-primary mb-5">
                        ${item.price.toFixed(2)}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <p className="text-foreground/80 text-[14px] leading-relaxed mb-8 font-normal">
                            {item.description}
                        </p>
                    )}

                    {/* Dynamic Variants Sections rendered with checkboxes */}
                    {item.variants && item.variants.map((variant) => (
                        <div key={variant.type} className="mb-6 last:mb-4">
                            <div className="flex items-center gap-2.5 mb-3">
                                <h3 className="text-base font-bold text-foreground">
                                    {variant.type}
                                </h3>
                                {variant.isRequired && variant.choices.length > 1 && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground rounded">
                                        Required
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {variant.choices.map((choice) => {
                                    const isSelected = selectedChoices[variant.type]?.includes(choice.label) || false;
                                    const isCheckbox = variant.allowedMultiple || variant.choices.length <= 1;
                                    return (
                                        <div
                                            key={choice.label}
                                            onClick={() => {
                                                if (isCheckbox) {
                                                    handleToggleCheckbox(variant.type, choice.label);
                                                } else {
                                                    handleSelectRadio(variant.type, choice.label);
                                                }
                                            }}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-full border cursor-pointer select-none transition-all duration-200 ${isSelected
                                                ? "border-primary bg-primary/5 text-foreground"
                                                : "border-border bg-white/40 hover:border-primary/50 text-foreground"
                                                }`}
                                        >
                                            {/* Checkbox indicator system */}
                                            {isCheckbox ? (
                                                <div
                                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors duration-150 ${isSelected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border bg-white"
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-150 ${isSelected ? "border-primary" : "border-border bg-white"
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                            )}
                                            <span className="text-sm font-semibold">
                                                {choice.label}
                                                {choice.price > 0 && (
                                                    <span className="text-muted-foreground font-normal">
                                                        {" "}(+${choice.price.toFixed(2)})
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Quantity Stepper & Add Button Stacked */}
                    <div className="mt-8 pt-6 border-t border-border/50">
                        {/* Stepper */}
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-9 h-9 border border-border/80 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-white/50 active:scale-95 transition text-lg font-medium"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-bold text-base text-foreground">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className="w-9 h-9 border border-border/80 rounded-lg flex items-center justify-center text-primary font-bold hover:bg-white/50 active:scale-95 transition text-lg font-medium"
                            >
                                +
                            </button>
                        </div>

                        {/* Add to Order Button */}
                        <button
                            onClick={handleAddToOrder}
                            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-primary hover:bg-primary/95 text-white text-base font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add to Order
                        </button>
                    </div>
                </div>
            </div>

            {/* Premium Centered Footer */}
            <footer className="w-full max-w-7xl mx-auto px-6 border-t border-border pt-8 pb-12 mt-12 text-muted-foreground text-xs">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                    {/* Navigation links */}
                    <div className="flex gap-6">
                        <a href="/" className="hover:text-foreground transition-colors">Home</a>
                        <a href="/" className="hover:text-foreground transition-colors">Menu</a>
                        <a href="/info" className="hover:text-foreground transition-colors">About Us</a>
                        <a href="/info" className="hover:text-foreground transition-colors">Contact</a>
                    </div>
                    {/* Social icons */}
                    <div className="flex gap-5 text-sm">
                        <a href="#" className="hover:text-foreground transition-colors">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            <i className="fab fa-tiktok"></i>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground/60 border-t border-border/40 pt-4">
                    <span>Copyright © 2022 - AI Menu Redesign</span>
                    <span>www.GourmetGo</span>
                </div>
            </footer>
        </div>
    );
};