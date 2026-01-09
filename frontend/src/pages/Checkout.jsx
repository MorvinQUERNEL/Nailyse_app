import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const { cart, total } = useCart();
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");

    // Pre-fill with user data if logged in
    useEffect(() => {
        if (user) {
            setClientName(user.fullName || "");
            setClientEmail(user.email || "");
        }
    }, [user]);

    const handlePayment = async () => {
        if (cart.length === 0) {
            setError(t("checkout.emptyCart"));
            return;
        }

        if (!clientEmail || !clientName) {
            setError(t("checkout.fillNameEmail"));
            return;
        }

        // Save for email after payment
        localStorage.setItem('checkout_email', clientEmail);
        localStorage.setItem('checkout_name', clientName);
        localStorage.setItem('checkout_language', language);

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/api/payment/create-session`, {
                items: cart,
            });

            if (response.data && response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error("URL de paiement non fournie");
            }
        } catch (error) {
            console.error("Erreur lors du paiement:", error);

            if (error.response) {
                setError("Erreur serveur. Veuillez réessayer.");
            } else if (error.request) {
                setError("Impossible de contacter le serveur.");
            } else {
                setError("Une erreur inattendue est survenue.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-cream dark:bg-chocolate flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 rounded-full bg-champagne dark:bg-espresso flex items-center justify-center mx-auto mb-8">
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
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </div>
                    <h2 className="font-display text-3xl text-chocolate dark:text-cream mb-4">
                        {t("checkout.emptyCart")}
                    </h2>
                    <p className="font-body text-espresso/60 dark:text-cream/60 mb-8">
                        {t("checkout.discoverCollection")}
                    </p>
                    <Link
                        to="/shop"
                        className="inline-block py-4 px-8 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase"
                    >
                        {t("checkout.visitShop")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream dark:bg-chocolate pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="font-body text-sm tracking-[0.3em] uppercase text-rosegold mb-4 block">
                        {t("checkout.subtitle")}
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl font-light text-chocolate dark:text-cream">
                        {t("checkout.title")}{" "}
                        <span className="italic text-wine dark:text-blush">{t("checkout.titleHighlight")}</span>
                    </h1>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-3 bg-white dark:bg-espresso p-8">
                        <h2 className="font-display text-2xl text-chocolate dark:text-cream mb-6">
                            {t("checkout.summary")}
                        </h2>

                        <div className="space-y-6">
                            {cart.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex gap-4 pb-6 border-b border-espresso/10 dark:border-cream/10 last:border-0"
                                >
                                    <div className="w-20 h-20 bg-champagne dark:bg-chocolate overflow-hidden flex-shrink-0">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-display text-lg text-chocolate dark:text-cream">
                                            {product.name}
                                        </h3>
                                        <p className="font-body text-sm text-espresso/60 dark:text-cream/60 mt-1">
                                            {t("checkout.quantity")}: {product.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-display text-xl text-wine dark:text-rosegold">
                                            {(product.price * product.quantity).toFixed(2)} €
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-espresso p-8 sticky top-32">
                            {/* Client Info */}
                            <h2 className="font-display text-2xl text-chocolate dark:text-cream mb-6">
                                {t("checkout.yourInfo")}
                            </h2>
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block font-body text-sm text-espresso/60 dark:text-cream/60 mb-2">
                                        {t("checkout.fullName")}
                                    </label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder={t("checkout.fullName")}
                                        className="w-full px-4 py-3 bg-champagne/30 dark:bg-chocolate border-0 font-body text-chocolate dark:text-cream placeholder:text-espresso/40 dark:placeholder:text-cream/40 focus:ring-2 focus:ring-rosegold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-body text-sm text-espresso/60 dark:text-cream/60 mb-2">
                                        {t("checkout.email")}
                                    </label>
                                    <input
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        className="w-full px-4 py-3 bg-champagne/30 dark:bg-chocolate border-0 font-body text-chocolate dark:text-cream placeholder:text-espresso/40 dark:placeholder:text-cream/40 focus:ring-2 focus:ring-rosegold outline-none"
                                    />
                                </div>
                            </div>

                            <h2 className="font-display text-2xl text-chocolate dark:text-cream mb-6">
                                {t("checkout.total")}
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between font-body text-espresso/60 dark:text-cream/60">
                                    <span>{t("checkout.subtotal")}</span>
                                    <span>{total.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between font-body">
                                    <span className="text-espresso/60 dark:text-cream/60">
                                        {t("checkout.shipping")}
                                    </span>
                                    <span className="text-green-600 dark:text-green-400">
                                        {t("checkout.free")}
                                    </span>
                                </div>
                                <div className="border-t border-espresso/10 dark:border-cream/10 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60">
                                            {t("checkout.total")}
                                        </span>
                                        <span className="font-display text-3xl text-chocolate dark:text-cream">
                                            {total.toFixed(2)} €
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 font-body text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Pay Button */}
                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="group relative w-full py-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            {t("checkout.processing")}
                                        </>
                                    ) : (
                                        t("checkout.payNow")
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>

                            {/* Security Notice */}
                            <div className="mt-6 text-center">
                                <div className="flex items-center justify-center gap-2 text-espresso/40 dark:text-cream/40 mb-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    <span className="font-body text-xs">
                                        {t("checkout.securePayment")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
