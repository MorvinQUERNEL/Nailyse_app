import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import UserMenu from "../UserMenu";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { cart, setIsOpen } = useCart();
    const { language, setLanguage, t } = useLanguage();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { path: "/", label: t("nav.home") },
        { path: "/shop", label: t("nav.shop") },
        { path: "/appointments", label: t("nav.appointments") },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? "bg-cream/95 dark:bg-chocolate/95 backdrop-blur-md shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="relative z-10">
                        <span className="font-display text-2xl md:text-3xl text-chocolate dark:text-cream">
                            Nailyse
                        </span>
                    </Link>

                    {/* Center Navigation */}
                    <div className="hidden md:flex items-center space-x-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative font-body text-sm tracking-wider uppercase transition-colors ${
                                    location.pathname === link.path
                                        ? "text-wine dark:text-rosegold"
                                        : "text-espresso/70 dark:text-cream/70 hover:text-wine dark:hover:text-rosegold"
                                }`}
                            >
                                {link.label}
                                {location.pathname === link.path && (
                                    <span className="absolute -bottom-1 left-0 w-full h-px bg-wine dark:bg-rosegold" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Button */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="relative p-2 text-espresso/70 dark:text-cream/70 hover:text-wine dark:hover:text-rosegold transition-colors"
                            aria-label="Ouvrir le panier"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-wine dark:bg-rosegold text-cream dark:text-chocolate text-xs font-body flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-espresso/70 dark:text-cream/70 hover:text-wine dark:hover:text-rosegold transition-colors"
                            aria-label="Changer le thème"
                        >
                            {theme === "dark" ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Language Toggle */}
                        <div className="flex items-center bg-champagne/30 dark:bg-espresso/50 rounded-full p-0.5">
                            <button
                                onClick={() => setLanguage("fr")}
                                className={`px-2.5 py-1 text-xs font-body tracking-wider rounded-full transition-all duration-300 ${
                                    language === "fr"
                                        ? "bg-wine dark:bg-rosegold text-cream dark:text-chocolate"
                                        : "text-espresso/60 dark:text-cream/60 hover:text-wine dark:hover:text-rosegold"
                                }`}
                                aria-label="Français"
                            >
                                FR
                            </button>
                            <button
                                onClick={() => setLanguage("en")}
                                className={`px-2.5 py-1 text-xs font-body tracking-wider rounded-full transition-all duration-300 ${
                                    language === "en"
                                        ? "bg-wine dark:bg-rosegold text-cream dark:text-chocolate"
                                        : "text-espresso/60 dark:text-cream/60 hover:text-wine dark:hover:text-rosegold"
                                }`}
                                aria-label="English"
                            >
                                EN
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-6 bg-espresso/20 dark:bg-cream/20" />

                        {/* User Menu */}
                        <UserMenu />
                    </div>
                </div>
            </div>
        </nav>
    );
}
