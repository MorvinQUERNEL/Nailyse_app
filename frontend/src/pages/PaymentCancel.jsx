import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function PaymentCancel() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-cream dark:bg-chocolate flex items-center justify-center px-4">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blush/20 to-transparent dark:from-burgundy/20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-champagne/30 to-transparent dark:from-espresso/30 pointer-events-none" />

            <div className="relative max-w-md w-full bg-white dark:bg-espresso p-10 text-center">
                {/* Cancel Icon */}
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-10 h-10 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="font-display text-3xl text-chocolate dark:text-cream mb-4">
                    {t("payment.cancel.title")}{" "}
                    <span className="italic text-wine dark:text-rosegold">{t("payment.cancel.titleHighlight")}</span>
                </h1>

                <p className="font-body text-espresso/60 dark:text-cream/60 mb-8">
                    {t("payment.cancel.message")}
                </p>

                {/* CTAs */}
                <div className="space-y-4">
                    <Link
                        to="/checkout"
                        className="group relative block w-full py-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300"
                    >
                        <span className="relative z-10">{t("payment.cancel.retry")}</span>
                        <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>

                    <Link
                        to="/shop"
                        className="block w-full py-4 border border-espresso/20 dark:border-cream/20 text-chocolate dark:text-cream font-body text-sm tracking-wider uppercase hover:border-wine dark:hover:border-rosegold hover:text-wine dark:hover:text-rosegold transition-all"
                    >
                        {t("payment.cancel.backHome")}
                    </Link>
                </div>

                {/* Help */}
                <p className="mt-8 font-body text-xs text-espresso/40 dark:text-cream/40">
                    <a
                        href="mailto:contact@nailyse.fr"
                        className="text-wine dark:text-rosegold hover:underline"
                    >
                        contact@nailyse.fr
                    </a>
                </p>
            </div>
        </div>
    );
}
