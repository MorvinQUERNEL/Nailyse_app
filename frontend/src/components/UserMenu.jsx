import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/");
    };

    if (!isAuthenticated()) {
        return (
            <div className="flex items-center space-x-4">
                <Link
                    to="/login"
                    className="font-body text-sm tracking-wider text-espresso/70 dark:text-cream/70 hover:text-wine dark:hover:text-rosegold transition-colors"
                >
                    Connexion
                </Link>
                <Link
                    to="/register"
                    className="font-body text-sm tracking-wider py-2 px-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate hover:bg-burgundy dark:hover:bg-champagne transition-colors"
                >
                    Inscription
                </Link>
            </div>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            {/* User Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 text-espresso/70 dark:text-cream/70 hover:text-wine dark:hover:text-rosegold transition-colors"
            >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-wine dark:bg-rosegold flex items-center justify-center text-cream dark:text-chocolate font-display text-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                </div>

                {/* Name & Badge */}
                <div className="hidden md:flex items-center gap-2">
                    <span className="font-body text-sm">{user.fullName}</span>
                    {isAdmin() && (
                        <span className="font-body text-xs px-2 py-0.5 bg-rosegold/20 text-rosegold rounded-full">
                            Admin
                        </span>
                    )}
                </div>

                {/* Arrow */}
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-espresso shadow-xl border border-espresso/10 dark:border-cream/10 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-espresso/10 dark:border-cream/10">
                        <p className="font-display text-lg text-chocolate dark:text-cream">
                            {user.fullName}
                        </p>
                        <p className="font-body text-xs text-espresso/60 dark:text-cream/60 truncate">
                            {user.email}
                        </p>
                        {isAdmin() && (
                            <span className="inline-block mt-2 font-body text-xs px-2 py-0.5 bg-rosegold/20 text-rosegold rounded-full">
                                Administrateur
                            </span>
                        )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full text-left px-4 py-2 font-body text-sm text-espresso/70 dark:text-cream/70 hover:bg-champagne/50 dark:hover:bg-chocolate hover:text-wine dark:hover:text-rosegold transition-colors"
                        >
                            Mon compte
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full text-left px-4 py-2 font-body text-sm text-espresso/70 dark:text-cream/70 hover:bg-champagne/50 dark:hover:bg-chocolate hover:text-wine dark:hover:text-rosegold transition-colors"
                        >
                            Mes commandes
                        </button>
                        {isAdmin() && (
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full text-left px-4 py-2 font-body text-sm text-wine dark:text-rosegold hover:bg-champagne/50 dark:hover:bg-chocolate transition-colors"
                            >
                                Panneau admin
                            </button>
                        )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-espresso/10 dark:border-cream/10 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 font-body text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
