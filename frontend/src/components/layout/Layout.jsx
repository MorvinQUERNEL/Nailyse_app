import Navbar from "./Navbar";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
    const { cart, isOpen, setIsOpen, removeFromCart, total } = useCart();

    return (
        <div className="min-h-screen bg-cream dark:bg-chocolate transition-colors duration-500 font-body">
            <Navbar />
            <main>
                {children}
            </main>

            {/* Elegant Cart Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-cream dark:bg-chocolate shadow-2xl transform transition-transform duration-500 ease-out z-50 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="h-full flex flex-col">
                    {/* Cart Header */}
                    <div className="p-8 border-b border-espresso/10 dark:border-cream/10">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-body text-xs tracking-[0.2em] uppercase text-rosegold">
                                    Votre Sélection
                                </span>
                                <h3 className="font-display text-3xl text-chocolate dark:text-cream mt-1">
                                    Panier
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center border border-espresso/20 dark:border-cream/20 text-espresso/60 dark:text-cream/60 hover:border-wine dark:hover:border-rosegold hover:text-wine dark:hover:text-rosegold transition-colors"
                                aria-label="Fermer le panier"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-champagne dark:bg-espresso flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-rosegold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="font-display text-xl text-chocolate dark:text-cream mb-2">
                                    Votre panier est vide
                                </p>
                                <p className="font-body text-sm text-espresso/60 dark:text-cream/60">
                                    Découvrez notre collection
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 pb-6 border-b border-espresso/10 dark:border-cream/10 last:border-0"
                                    >
                                        <div className="w-20 h-20 bg-champagne dark:bg-espresso overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-display text-lg text-chocolate dark:text-cream truncate">
                                                {item.name}
                                            </h4>
                                            <p className="font-body text-sm text-espresso/60 dark:text-cream/60 mt-1">
                                                Qté: {item.quantity}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-display text-lg text-wine dark:text-rosegold">
                                                    {(item.price * item.quantity).toFixed(2)} €
                                                </span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="font-body text-xs tracking-wider uppercase text-espresso/40 dark:text-cream/40 hover:text-wine dark:hover:text-rosegold transition-colors"
                                                >
                                                    Retirer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Footer */}
                    {cart.length > 0 && (
                        <div className="p-8 border-t border-espresso/10 dark:border-cream/10 bg-champagne/30 dark:bg-espresso/30">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60">
                                    Total
                                </span>
                                <span className="font-display text-3xl text-chocolate dark:text-cream">
                                    {total.toFixed(2)} €
                                </span>
                            </div>
                            <Link
                                to="/checkout"
                                onClick={() => setIsOpen(false)}
                                className="group relative block w-full text-center py-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300"
                            >
                                <span className="relative z-10">Procéder au paiement</span>
                                <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                            <p className="text-center font-body text-xs text-espresso/40 dark:text-cream/40 mt-4">
                                Livraison gratuite en France
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-chocolate/60 dark:bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Elegant Footer */}
            <footer className="bg-espresso dark:bg-chocolate border-t border-cream/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    <div className="grid md:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <span className="font-display text-3xl text-cream">Nailyse</span>
                            <p className="font-body text-cream/60 mt-4 max-w-sm leading-relaxed">
                                L'art de la manucure au service de votre beauté.
                                Des soins d'exception pour des mains sublimes.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-rosegold mb-6">
                                Navigation
                            </h4>
                            <ul className="space-y-3">
                                {["Accueil", "Boutique", "Rendez-vous"].map((item) => (
                                    <li key={item}>
                                        <a
                                            href={item === "Accueil" ? "/" : `/${item.toLowerCase().replace("-", "")}`}
                                            className="font-body text-cream/60 hover:text-rosegold transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-rosegold mb-6">
                                Contact
                            </h4>
                            <ul className="space-y-3 font-body text-cream/60">
                                <li>contact@nailyse.fr</li>
                                <li>01 23 45 67 89</li>
                                <li>Paris, France</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-cream/10 mt-12 pt-8 text-center">
                        <p className="font-body text-sm text-cream/40">
                            © 2024 Nailyse. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
