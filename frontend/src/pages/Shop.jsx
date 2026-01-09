import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/shop/ProductCard";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function Shop() {
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${API_URL}/api/products`, {
                    headers: {
                        Accept: "application/ld+json",
                    },
                });

                const productsList =
                    response.data.member || response.data["hydra:member"] || [];
                setProducts(productsList);
            } catch (error) {
                console.error("Erreur lors du chargement des produits:", error);

                if (error.response) {
                    setError(t("shop.error"));
                } else if (error.request) {
                    setError(t("shop.serverError"));
                } else {
                    setError(t("shop.error"));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [API_URL]);

    return (
        <div className="relative min-h-screen bg-cream dark:bg-chocolate pt-32 pb-20">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-bl from-champagne/50 to-transparent dark:from-espresso/50 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
                {/* Page Header */}
                <div className="mb-16">
                    <span className="font-body text-sm tracking-[0.3em] uppercase text-rosegold mb-4 block">
                        {t("shop.subtitle")}
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-chocolate dark:text-cream">
                            {t("shop.title")}{" "}
                            <span className="italic text-wine dark:text-blush">
                                {t("shop.titleHighlight")}
                            </span>
                        </h1>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-2 border-rosegold/20 rounded-full" />
                            <div className="absolute inset-0 border-2 border-transparent border-t-rosegold rounded-full animate-spin" />
                        </div>
                        <p className="mt-6 font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60">
                            {t("shop.loading")}
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-wine/10 dark:bg-wine/20 border border-wine/30 p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-wine/20 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-wine"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <p className="font-body text-wine dark:text-wine/80 mb-4">
                                {error}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="font-body text-sm tracking-wider uppercase text-wine hover:text-burgundy transition-colors"
                            >
                                {t("shop.retry")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && (
                    <>
                        {products.length === 0 ? (
                            <div className="text-center py-32">
                                <div className="w-24 h-24 rounded-full bg-champagne dark:bg-espresso flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-10 h-10 text-rosegold"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                                <p className="font-display text-2xl text-chocolate dark:text-cream mb-2">
                                    Aucun produit disponible
                                </p>
                                <p className="font-body text-espresso/60 dark:text-cream/60">
                                    Revenez bientôt pour découvrir notre collection
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="opacity-0 animate-fade-up"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            animationFillMode: "forwards",
                                        }}
                                    >
                                        <ProductCard
                                            product={product}
                                            addToCart={addToCart}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
