import { createContext, useContext, useState, useEffect } from "react";

/**
 * Contexte du panier (CartContext)
 * Permet de partager l'état du panier et les fonctions de manipulation
 * à travers toute l'application.
 */
const CartContext = createContext();

/**
 * Provider du Panier (CartProvider)
 * Enveloppe l'application pour fournir l'accès au panier.
 * Gère la persistance du panier dans localStorage pour conserver les articles entre les sessions.
 *
 * @param {Object} props - Propriétés du composant
 * @param {ReactNode} props.children - Composants enfants à envelopper
 */
export const CartProvider = ({ children }) => {
    /**
     * État local pour stocker les articles du panier
     * Initialise depuis localStorage si des données existent, sinon tableau vide
     */
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('nailyse_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Erreur lors du chargement du panier depuis localStorage:', error);
            return [];
        }
    });

    // État pour gérer la visibilité du panneau latéral du panier
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Effet pour persister le panier dans localStorage à chaque modification
     * Sauvegarde automatique pour conserver les articles entre les sessions
     */
    useEffect(() => {
        try {
            localStorage.setItem('nailyse_cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier dans localStorage:', error);
        }
    }, [cart]);

    /**
     * Ajoute un produit au panier.
     * Si le produit existe déjà, incrémente sa quantité.
     * @param {Object} product - Le produit à ajouter
     */
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                // Si l'article existe, on met à jour la quantité
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Sinon on l'ajoute avec une quantité initiale de 1
            return [...prev, { ...product, quantity: 1 }];
        });
        // Ouvre automatiquement le panier après un ajout
        setIsOpen(true);
    };

    /**
     * Supprime un article du panier via son ID.
     * Met automatiquement à jour le localStorage via l'effet useEffect.
     *
     * @param {number} id - L'ID du produit à supprimer
     */
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    /**
     * Vide complètement le panier
     * Utile après un paiement réussi ou pour réinitialiser le panier
     */
    const clearCart = () => {
        setCart([]);
    };

    /**
     * Met à jour la quantité d'un article spécifique.
     * Empêche la quantité de descendre en dessous de 1.
     * @param {number} id - ID du produit
     * @param {number} quantity - Nouvelle quantité
     */
    const updateQuantity = (id, quantity) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
    };

    // Calcul du montant total du panier en temps réel
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            total,
            isOpen,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Hook personnalisé pour utiliser le contexte du panier.
 * @returns {Object} L'objet contexte contenant { cart, addToCart, ... }
 */
export const useCart = () => useContext(CartContext);

