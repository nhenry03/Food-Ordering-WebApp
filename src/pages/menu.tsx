import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { useDataProvider } from "../components/data-provider";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
    const { categories, items } = useDataProvider();
    const navigate = useNavigate();

    return (
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">
            {/* Page Header */}
            <div className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                    Our Menu
                </h1>
                <p className="mt-4 text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    Explore our curated selection of dishes, crafted with the finest ingredients to bring you a truly exceptional dining experience.
                </p>
            </div>

            {/* Categories Accordion */}
            <Accordion type="multiple" defaultValue={categories.map(c => c.id)} className="space-y-6">
                {categories.map((category) => {
                    const categoryItems = items.filter((item) => item.category === category.id);

                    return (
                        <AccordionItem
                            key={category.id}
                            value={category.id}
                            className="border border-border/40 rounded-xl overflow-hidden shadow-sm bg-card"
                        >
                            <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                                <div className="flex items-center gap-6 w-full">
                                    {/* Category Image */}
                                    <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-border/20 shadow-sm transition-transform duration-300">
                                        {category.image?.src ? (
                                            <img
                                                src={category.image.src}
                                                alt={category.image.title || category.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                                <span className="text-muted-foreground text-[10px] font-medium">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Category Info */}
                                    <div className="flex flex-col items-start text-left flex-1 min-w-0 pr-4">
                                        <h2 className="font-semibold text-xl text-foreground">
                                            {category.title}
                                        </h2>
                                        {category.description && (
                                            <p className="text-base text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-0 pb-0">
                                <div className="flex flex-col">
                                    {categoryItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group/item flex flex-col sm:flex-row gap-6 p-6 sm:p-8 cursor-pointer hover:bg-accent/30 transition-colors duration-200 border-t border-border/40"
                                            onClick={() => navigate(`/item/${item.id}`)}
                                        >
                                            {/* Item Image */}
                                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                                                {item.image?.src ? (
                                                    <img
                                                        src={item.image.src}
                                                        alt={item.image.title || item.label}
                                                        className="h-full w-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-muted flex items-center justify-center">
                                                        <span className="text-muted-foreground text-xs font-medium">No Img</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Item Info */}
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="font-semibold text-xl text-foreground group-hover/item:text-primary transition-colors duration-200">
                                                        {item.label}
                                                    </h3>
                                                    <span className="font-semibold text-xl text-primary flex-shrink-0">
                                                        ${item.price.toFixed(2)}
                                                    </span>
                                                </div>

                                                {item.description && (
                                                    <p className="text-base text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}

                                                <div className="mt-auto pt-4 flex items-center">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Add to cart logic here
                                                        }}
                                                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary/95 text-on-primary text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {categoryItems.length === 0 && (
                                        <p className="text-sm text-muted-foreground/60 text-center py-8 italic border-t border-border/40">
                                            No items in this category yet
                                        </p>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}