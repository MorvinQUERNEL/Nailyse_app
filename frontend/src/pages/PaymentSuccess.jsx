import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { width, height } = useWindowSize();
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const { t } = useLanguage();
    const [emailSent, setEmailSent] = useState(false);

    // Send confirmation email on successful payment
    useEffect(() => {
        const sendConfirmationEmail = async () => {
            if (emailSent || !sessionId || cartItems.length === 0) return;

            try {
                await axios.post(`${API_URL}/api/payment/confirm`, {
                    sessionId,
                    email: user?.email || localStorage.getItem('checkout_email'),
                    clientName: user?.fullName || localStorage.getItem('checkout_name') || 'Client',
                    language: localStorage.getItem('checkout_language') || 'fr',
                    items: cartItems.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                });
                setEmailSent(true);
                clearCart();
            } catch (error) {
                console.error('Erreur envoi email:', error);
            }
        };

        sendConfirmationEmail();
    }, [sessionId, cartItems, user, emailSent, clearCart]);

    return (
        <div className="min-h-screen bg-cream dark:bg-chocolate flex items-center justify-center px-4 relative overflow-hidden">
            {/* Confetti */}
            <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={300}
                colors={["#C9A87C", "#722F37", "#F5E6D3", "#E8D5D5", "#4A1C2B"]}
            />

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-champagne/30 to-transparent dark:from-espresso/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blush/20 to-transparent dark:from-burgundy/20 pointer-events-none" />

            <div className="relative max-w-md w-full bg-white dark:bg-espresso p-10 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-10 h-10 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="font-display text-3xl text-chocolate dark:text-cream mb-4">
                    {t("payment.success.title")}{" "}
                    <span className="italic text-wine dark:text-rosegold">{t("payment.success.titleHighlight")}</span>
                </h1>

                <p className="font-body text-espresso/60 dark:text-cream/60 mb-8">
                    {t("payment.success.message")}
                </p>

                {/* Transaction ID */}
                <div className="bg-champagne/30 dark:bg-chocolate p-4 mb-8">
                    <p className="font-body text-xs tracking-wider uppercase text-espresso/40 dark:text-cream/40 mb-1">
                        {t("payment.success.transactionId")}
                    </p>
                    <p className="font-mono text-sm text-chocolate dark:text-cream break-all">
                        {sessionId || "simulation_id_12345"}
                    </p>
                </div>

                {/* CTA */}
                <Link
                    to="/"
                    className="group relative inline-block w-full py-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300"
                >
                    <span className="relative z-10">{t("payment.success.backHome")}</span>
                    <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>

                <Link
                    to="/shop"
                    className="inline-block mt-4 font-body text-sm text-wine dark:text-rosegold hover:underline"
                >
                    {t("payment.success.continueShopping")}
                </Link>
            </div>
        </div>
    );
}
