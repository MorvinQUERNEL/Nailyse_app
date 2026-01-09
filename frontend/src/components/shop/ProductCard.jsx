export default function ProductCard({ product, addToCart }) {
    return (
        <div className="group relative bg-white dark:bg-espresso overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-chocolate/10 dark:hover:shadow-black/30">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-champagne dark:bg-chocolate">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-chocolate/0 group-hover:bg-chocolate/20 dark:group-hover:bg-black/30 transition-colors duration-300" />

                {/* Quick Add Button - Appears on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full py-3 bg-cream dark:bg-chocolate text-chocolate dark:text-cream font-body text-sm tracking-wider uppercase hover:bg-rosegold hover:text-cream dark:hover:bg-rosegold dark:hover:text-chocolate transition-colors duration-300"
                    >
                        Ajouter au panier
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl text-chocolate dark:text-cream truncate group-hover:text-wine dark:group-hover:text-rosegold transition-colors">
                            {product.name}
                        </h3>
                        <p className="font-body text-sm text-espresso/60 dark:text-cream/60 mt-1 line-clamp-2">
                            {product.description}
                        </p>
                    </div>
                    <span className="font-display text-2xl text-wine dark:text-rosegold flex-shrink-0">
                        {product.price}€
                    </span>
                </div>

                {/* Mobile Add Button */}
                <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full py-3 border border-espresso/20 dark:border-cream/20 text-chocolate dark:text-cream font-body text-sm tracking-wider uppercase hover:bg-wine hover:border-wine hover:text-cream dark:hover:bg-rosegold dark:hover:border-rosegold dark:hover:text-chocolate transition-all duration-300 md:hidden"
                >
                    Ajouter au panier
                </button>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-px h-8 bg-rosegold/30 dark:bg-rosegold/20 origin-top-right" />
                <div className="absolute top-0 right-0 w-8 h-px bg-rosegold/30 dark:bg-rosegold/20 origin-top-right" />
            </div>
        </div>
    );
}
