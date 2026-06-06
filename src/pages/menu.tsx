import { useState, useEffect } from "react";
import { useDataProvider } from "../components/data-provider";
import { useNavigate } from "react-router-dom";

// ─── Design tokens from DESIGN.md ────────────────────────────────────────────
// Colors
const C = {
    background: "#f4f1ea",   // page canvas (light beige)
    surface: "#ffffff",      // card surface (white box)
    surfaceLow: "#eae6df",   // low surface background
    onSurface: "#1b1c1c",    // primary text (charcoal)
    onSurfaceVariant: "#5b4039", // secondary text (warm taupe)
    outline: "#eae5db",      // border / divider (light sand)
    outlineVariant: "#eae5db", // subtle divider
    primary: "#b24b31",      // price/actions (very muted terracotta brick orange)
    onPrimary: "#ffffff",    // text on primary
    neutral: "#7a6e67",      // metadata, labels (muted brown-gray)
} as const;

// Typography scale (Inter, from DESIGN.md)
const T = {
    displayLg: { fontSize: 48, fontWeight: 700, lineHeight: "56px", letterSpacing: "-0.02em" },
    headlineLg: { fontSize: 32, fontWeight: 700, lineHeight: "40px", letterSpacing: "-0.01em" },
    headlineMd: { fontSize: 24, fontWeight: 600, lineHeight: "32px" },
    bodyLg: { fontSize: 18, fontWeight: 400, lineHeight: "28px" },
    bodyMd: { fontSize: 16, fontWeight: 400, lineHeight: "24px" },
    labelMd: { fontSize: 14, fontWeight: 500, lineHeight: "20px", letterSpacing: "0.01em" },
    labelSm: { fontSize: 12, fontWeight: 600, lineHeight: "16px", letterSpacing: "0.05em" },
} as const;

// Spacing (8px base scale)
const S = {
    2: 4,   // 0.5×
    4: 8,   // 1×  base
    6: 12,
    8: 16,
    12: 24,  // gutter
    16: 32,
    20: 40,  // margin-desktop
    24: 48,
    28: 56,
    36: 72,
    40: 80,
} as const;

// Border-radius tokens
const R = {
    sm: "0.25rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
} as const;
// ─────────────────────────────────────────────────────────────────────────────

export const Menu = () => {
    const { categories, items } = useDataProvider();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<string>("");

    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].id);
        }
    }, [categories, activeCategory]);

    const activeCategoryItems = items.filter((item) => item.category === activeCategory);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                /* Reset & base */
                .menu-root * { box-sizing: border-box; }
                .menu-root {
                    min-height: 100vh;
                    background: ${C.background};
                    font-family: 'Inter', sans-serif;
                    color: ${C.onSurface};
                }

                /* ── Header ── */
                .menu-header {
                    text-align: center;
                    margin-bottom: ${S[24]}px;
                }
                .menu-title {
                    font-size: ${T.displayLg.fontSize}px;
                    font-weight: ${T.displayLg.fontWeight};
                    line-height: ${T.displayLg.lineHeight};
                    letter-spacing: ${T.displayLg.letterSpacing};
                    color: ${C.onSurface};
                    margin: 0 0 ${S[8]}px;
                }
                @media (max-width: 640px) {
                    .menu-title {
                        font-size: 36px;
                        line-height: 44px;
                    }
                }
                .menu-subtitle {
                    font-size: ${T.bodyMd.fontSize}px;
                    font-weight: ${T.bodyMd.fontWeight};
                    line-height: ${T.bodyMd.lineHeight};
                    color: ${C.neutral};
                    max-width: 480px;
                    margin: 0 auto;
                }

                /* ── Category tabs ── */
                .tab-bar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: ${S[8]}px;
                    padding-bottom: ${S[24]}px;
                    margin-bottom: ${S[24]}px;
                    border-bottom: 1px solid ${C.outlineVariant};
                }

                .tab-btn {
                    padding: ${S[6]}px ${S[16]}px;
                    border-radius: ${R.full};
                    background: ${C.surface};
                    border: 1px solid ${C.outlineVariant};
                    font-family: 'Inter', sans-serif;
                    font-size: ${T.bodyMd.fontSize}px;
                    font-weight: ${T.labelMd.fontWeight};
                    color: ${C.neutral};
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .tab-btn:hover {
                    color: ${C.onSurface};
                    border-color: ${C.outline};
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }
                .tab-btn.is-active {
                    color: ${C.onPrimary};
                    background: ${C.primary};
                    border-color: ${C.primary};
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(178, 75, 49, 0.15);
                }

                /* ── Items grid ── */
                .items-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: ${S[12]}px;
                }
                @media (max-width: 640px) {
                    .items-grid {
                        grid-template-columns: 1fr;
                        gap: ${S[8]}px;
                    }
                }

                /* ── Card ── */
                /* Elevation spec from DESIGN.md:
                   soft broad shadow (blur 20px, 4%) + tight shadow (blur 4px, 4%) */
                .item-card {
                    display: flex;
                    flex-direction: column;
                    background: ${C.surface};
                    border-radius: ${R.xl};
                    overflow: hidden;
                    padding: 16px; /* White box wrapped around the outside with 16px padding */
                    border: 1px solid rgba(0, 0, 0, 0.04);
                    box-shadow:
                        0 2px 8px rgba(0, 0, 0, 0.02),
                        0 8px 24px rgba(0, 0, 0, 0.02);
                    cursor: pointer;
                    transition: transform 0.28s ease, box-shadow 0.28s ease;
                }
                .item-card:hover {
                    transform: translateY(-4px);
                    box-shadow:
                        0 12px 32px rgba(178, 75, 49, 0.08),
                        0 4px 12px rgba(0, 0, 0, 0.02);
                }

                /* Image area with inset padding */
                .card-image {
                    width: 100%;
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                    background: ${C.surfaceLow};
                    border-radius: ${R.lg}; /* Rounded corners inside the card frame */
                }
                .card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.6s ease;
                }
                .item-card:hover .card-image img {
                    transform: scale(1.04);
                }
                .card-image-empty {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${T.labelMd.fontSize}px;
                    font-weight: ${T.labelMd.fontWeight};
                    color: ${C.neutral};
                }

                /* Card content */
                .card-body {
                    padding: 16px 4px 4px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    gap: ${S[4]}px;
                }

                .card-name {
                    font-size: ${T.headlineMd.fontSize}px;
                    font-weight: ${T.headlineMd.fontWeight};
                    line-height: ${T.headlineMd.lineHeight};
                    color: ${C.onSurface};
                    margin: 0;
                    transition: color 0.2s ease;
                }
                .item-card:hover .card-name { color: ${C.primary}; }

                .card-desc {
                    font-size: ${T.bodyMd.fontSize}px;
                    font-weight: ${T.bodyMd.fontWeight};
                    line-height: ${T.bodyMd.lineHeight};
                    color: ${C.neutral};
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .card-footer {
                    margin-top: auto;
                    padding-top: ${S[8]}px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: ${S[8]}px;
                }

                .card-price {
                    font-size: ${T.headlineMd.fontSize}px;
                    font-weight: 700;
                    line-height: ${T.headlineMd.lineHeight};
                    color: ${C.primary};
                    letter-spacing: -0.01em;
                }

                /* Primary button — DESIGN.md: Primary Orange bg, white text, subtle shadow */
                .add-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px ${S[8]}px;
                    border-radius: ${R.full};
                    background: ${C.primary};
                    color: ${C.onPrimary};
                    font-family: 'Inter', sans-serif;
                    font-size: ${T.labelMd.fontSize}px;
                    font-weight: 600;
                    letter-spacing: ${T.labelMd.letterSpacing};
                    line-height: ${T.labelMd.lineHeight};
                    border: none;
                    cursor: pointer;
                    white-space: nowrap;
                    /* Subtle drop shadow */
                    box-shadow: 0 4px 12px rgba(178, 75, 49, 0.15);
                    transition: box-shadow 0.2s ease, transform 0.15s ease, background 0.15s ease;
                }
                /* Hover: increased shadow spread */
                .add-btn:hover {
                    box-shadow: 0 8px 24px rgba(178, 75, 49, 0.25);
                    background: #9c3f25; /* Burnt terracotta hover state */
                }
                .add-btn:active { transform: scale(0.96); }

                /* Empty state */
                .empty-state {
                    text-align: center;
                    padding: ${S[36]}px ${S[12]}px;
                    font-size: ${T.bodyLg.fontSize}px;
                    font-weight: ${T.bodyLg.fontWeight};
                    line-height: ${T.bodyLg.lineHeight};
                    color: ${C.neutral};
                    font-style: italic;
                }
            `}</style>

            <div className="menu-root">
                <div style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: `112px ${S[20]}px ${S[40]}px`,
                }}>

                    {/* ── Page header ── */}
                    <div className="menu-header">
                        <h1 className="menu-title">Our Menu</h1>
                        <p className="menu-subtitle">
                            Explore our curated selection of exquisite dishes, crafted with the finest
                            ingredients for an exceptional dining experience.
                        </p>
                    </div>

                    {/* ── Category tabs ── */}
                    <div className="tab-bar">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`tab-btn${activeCategory === category.id ? " is-active" : ""}`}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                {category.title}
                            </button>
                        ))}
                    </div>

                    {/* ── Items grid ── */}
                    {activeCategoryItems.length > 0 ? (
                        <div className="items-grid">
                            {activeCategoryItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="item-card"
                                    onClick={() => navigate(`/item/${item.id}`)}
                                >
                                    {/* Full-bleed image */}
                                    <div className="card-image">
                                        {item.image?.src ? (
                                            <img
                                                src={item.image.src}
                                                alt={item.image.title || item.label}
                                            />
                                        ) : (
                                            <div className="card-image-empty">No Image</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="card-body">
                                        <h2 className="card-name">{item.label}</h2>
                                        {item.description && (
                                            <p className="card-desc">{item.description}</p>
                                        )}
                                        <div className="card-footer">
                                            <span className="card-price">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No items available in this category yet.
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};
