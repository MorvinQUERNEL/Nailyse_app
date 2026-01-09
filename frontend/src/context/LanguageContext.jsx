import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("nailyse_lang") || "fr";
    });

    useEffect(() => {
        localStorage.setItem("nailyse_lang", language);
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === "fr" ? "en" : "fr");
    };

    const t = (key) => {
        const keys = key.split(".");
        let value = translations[language];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key;
            }
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

const translations = {
    fr: {
        // Navigation
        nav: {
            home: "Accueil",
            shop: "Boutique",
            appointments: "Rendez-vous",
            login: "Connexion",
            logout: "Déconnexion",
            register: "Inscription",
            cart: "Panier",
            admin: "Admin",
        },
        // Home page
        home: {
            hero: {
                salonLabel: "Salon de Manucure",
                title1: "L'Art de la",
                title2: "Beauté",
                title3: "des Mains",
                description: "Découvrez un univers d'élégance où chaque détail compte. Nos expertes subliment vos ongles avec passion et savoir-faire.",
                cta1: "Réserver",
                cta2: "Boutique",
                scroll: "Découvrir",
            },
            services: {
                label: "Nos Prestations",
                title: "Services",
                titleHighlight: "d'Exception",
                description: "Chaque prestation est réalisée avec des produits haut de gamme pour des résultats impeccables et durables.",
                viewAll: "Voir tous nos services",
                items: {
                    manicure: {
                        title: "Manucure Classique",
                        description: "Soin complet des ongles avec pose de vernis traditionnel",
                    },
                    gelUv: {
                        title: "Pose Gel UV",
                        description: "Extensions durables avec finition brillante longue tenue",
                    },
                    nailArt: {
                        title: "Nail Art",
                        description: "Créations artistiques personnalisées selon vos envies",
                    },
                    spa: {
                        title: "Soin Spa Mains",
                        description: "Rituel de beauté complet avec massage et gommage",
                    },
                },
            },
            stats: {
                clients: "Clientes Satisfaites",
                years: "Années d'Expérience",
                products: "Produits Premium",
            },
            cta: {
                label: "Prête pour l'expérience ?",
                title1: "Offrez à vos mains",
                title2: "le soin qu'elles méritent",
                description: "Réservez dès maintenant votre moment de beauté et laissez-vous chouchouter par nos expertes. Chaque visite est une expérience unique.",
                button1: "Réserver Maintenant",
                button2: "Explorer la Boutique",
            },
        },
        // Shop page
        shop: {
            title: "Notre",
            titleHighlight: "Collection",
            subtitle: "Boutique",
            addToCart: "Ajouter au panier",
            loading: "Chargement...",
            error: "Impossible de charger les produits",
            retry: "Réessayer",
            serverError: "Impossible de contacter le serveur. Vérifiez que le backend est démarré.",
        },
        // Cart
        cart: {
            title: "Votre Panier",
            empty: "Votre panier est vide",
            total: "Total",
            checkout: "Commander",
            remove: "Retirer",
            continueShopping: "Continuer mes achats",
        },
        // Checkout
        checkout: {
            title: "Votre",
            titleHighlight: "Commande",
            subtitle: "Finaliser",
            yourInfo: "Vos informations",
            fullName: "Nom complet",
            email: "Email",
            summary: "Récapitulatif",
            quantity: "Quantité",
            subtotal: "Sous-total",
            shipping: "Livraison",
            free: "Gratuite",
            total: "Total",
            payNow: "Payer maintenant",
            processing: "Traitement...",
            securePayment: "Paiement sécurisé via Stripe",
            emptyCart: "Votre panier est vide",
            discoverCollection: "Découvrez notre collection et ajoutez des produits à votre panier.",
            visitShop: "Visiter la boutique",
            fillNameEmail: "Veuillez remplir votre nom et email.",
        },
        // Payment
        payment: {
            success: {
                title: "Paiement",
                titleHighlight: "Réussi",
                message: "Merci pour votre commande ! Votre transaction a été validée avec succès.",
                transactionId: "ID de Transaction",
                backHome: "Retour à l'accueil",
                continueShopping: "Continuer mes achats",
            },
            cancel: {
                title: "Paiement",
                titleHighlight: "Annulé",
                message: "Votre paiement a été annulé. Aucun montant n'a été débité.",
                retry: "Réessayer",
                backHome: "Retour à l'accueil",
            },
        },
        // Appointments
        appointments: {
            title: "Prendre",
            titleHighlight: "Rendez-vous",
            subtitle: "Réservation",
            step1: "Choisir une date",
            step2: "Choisir une heure",
            step3: "Vos informations",
            weekendOnly: "Seuls les week-ends sont disponibles",
            selectSlot: "Veuillez sélectionner un créneau",
            fullName: "Nom complet",
            email: "Email",
            phone: "Téléphone",
            yourAppointment: "Votre rendez-vous",
            at: "à",
            confirm: "Confirmer le rendez-vous",
            sending: "Envoi en cours...",
            selectTime: "Veuillez sélectionner une heure.",
            invalidEmail: "Veuillez entrer une adresse email valide.",
            invalidPhone: "Veuillez entrer un numéro de téléphone valide.",
            success: "Rendez-vous demandé avec succès ! Confirmation par email.",
            invalidData: "Données invalides. Veuillez vérifier vos informations.",
            slotTaken: "Ce créneau est déjà réservé. Veuillez en choisir un autre.",
            serverError: "Impossible de contacter le serveur.",
            unexpectedError: "Une erreur inattendue est survenue.",
        },
        // Auth
        auth: {
            login: {
                title: "Connexion",
                email: "Email",
                password: "Mot de passe",
                submit: "Se connecter",
                noAccount: "Pas encore de compte ?",
                register: "S'inscrire",
                error: "Email ou mot de passe incorrect",
            },
            register: {
                title: "Inscription",
                fullName: "Nom complet",
                email: "Email",
                phone: "Téléphone (optionnel)",
                password: "Mot de passe",
                confirmPassword: "Confirmer le mot de passe",
                submit: "Créer mon compte",
                hasAccount: "Déjà un compte ?",
                login: "Se connecter",
                passwordMismatch: "Les mots de passe ne correspondent pas",
            },
        },
        // Common
        common: {
            loading: "Chargement...",
            error: "Erreur",
            success: "Succès",
            cancel: "Annuler",
            save: "Enregistrer",
            delete: "Supprimer",
            edit: "Modifier",
            back: "Retour",
            next: "Suivant",
            previous: "Précédent",
        },
    },
    en: {
        // Navigation
        nav: {
            home: "Home",
            shop: "Shop",
            appointments: "Appointments",
            login: "Login",
            logout: "Logout",
            register: "Register",
            cart: "Cart",
            admin: "Admin",
        },
        // Home page
        home: {
            hero: {
                salonLabel: "Nail Salon",
                title1: "The Art of",
                title2: "Beauty",
                title3: "for Hands",
                description: "Discover a world of elegance where every detail matters. Our experts enhance your nails with passion and expertise.",
                cta1: "Book Now",
                cta2: "Shop",
                scroll: "Discover",
            },
            services: {
                label: "Our Services",
                title: "Exceptional",
                titleHighlight: "Services",
                description: "Each service is performed with high-end products for impeccable and lasting results.",
                viewAll: "View all our services",
                items: {
                    manicure: {
                        title: "Classic Manicure",
                        description: "Complete nail care with traditional polish application",
                    },
                    gelUv: {
                        title: "UV Gel Application",
                        description: "Durable extensions with long-lasting glossy finish",
                    },
                    nailArt: {
                        title: "Nail Art",
                        description: "Personalized artistic creations according to your wishes",
                    },
                    spa: {
                        title: "Hand Spa Treatment",
                        description: "Complete beauty ritual with massage and exfoliation",
                    },
                },
            },
            stats: {
                clients: "Satisfied Clients",
                years: "Years of Experience",
                products: "Premium Products",
            },
            cta: {
                label: "Ready for the experience?",
                title1: "Give your hands",
                title2: "the care they deserve",
                description: "Book your beauty moment now and let yourself be pampered by our experts. Each visit is a unique experience.",
                button1: "Book Now",
                button2: "Explore the Shop",
            },
        },
        // Shop page
        shop: {
            title: "Our",
            titleHighlight: "Collection",
            subtitle: "Shop",
            addToCart: "Add to cart",
            loading: "Loading...",
            error: "Unable to load products",
            retry: "Retry",
            serverError: "Unable to reach the server. Make sure the backend is running.",
        },
        // Cart
        cart: {
            title: "Your Cart",
            empty: "Your cart is empty",
            total: "Total",
            checkout: "Checkout",
            remove: "Remove",
            continueShopping: "Continue shopping",
        },
        // Checkout
        checkout: {
            title: "Your",
            titleHighlight: "Order",
            subtitle: "Checkout",
            yourInfo: "Your information",
            fullName: "Full name",
            email: "Email",
            summary: "Summary",
            quantity: "Quantity",
            subtotal: "Subtotal",
            shipping: "Shipping",
            free: "Free",
            total: "Total",
            payNow: "Pay now",
            processing: "Processing...",
            securePayment: "Secure payment via Stripe",
            emptyCart: "Your cart is empty",
            discoverCollection: "Discover our collection and add products to your cart.",
            visitShop: "Visit the shop",
            fillNameEmail: "Please fill in your name and email.",
        },
        // Payment
        payment: {
            success: {
                title: "Payment",
                titleHighlight: "Successful",
                message: "Thank you for your order! Your transaction has been validated successfully.",
                transactionId: "Transaction ID",
                backHome: "Back to home",
                continueShopping: "Continue shopping",
            },
            cancel: {
                title: "Payment",
                titleHighlight: "Cancelled",
                message: "Your payment has been cancelled. No amount has been charged.",
                retry: "Try again",
                backHome: "Back to home",
            },
        },
        // Appointments
        appointments: {
            title: "Book an",
            titleHighlight: "Appointment",
            subtitle: "Booking",
            step1: "Choose a date",
            step2: "Choose a time",
            step3: "Your information",
            weekendOnly: "Only weekends are available",
            selectSlot: "Please select a time slot",
            fullName: "Full name",
            email: "Email",
            phone: "Phone",
            yourAppointment: "Your appointment",
            at: "at",
            confirm: "Confirm appointment",
            sending: "Sending...",
            selectTime: "Please select a time.",
            invalidEmail: "Please enter a valid email address.",
            invalidPhone: "Please enter a valid phone number.",
            success: "Appointment requested successfully! Confirmation by email.",
            invalidData: "Invalid data. Please check your information.",
            slotTaken: "This slot is already booked. Please choose another one.",
            serverError: "Unable to reach the server.",
            unexpectedError: "An unexpected error occurred.",
        },
        // Auth
        auth: {
            login: {
                title: "Login",
                email: "Email",
                password: "Password",
                submit: "Sign in",
                noAccount: "Don't have an account?",
                register: "Register",
                error: "Invalid email or password",
            },
            register: {
                title: "Register",
                fullName: "Full name",
                email: "Email",
                phone: "Phone (optional)",
                password: "Password",
                confirmPassword: "Confirm password",
                submit: "Create my account",
                hasAccount: "Already have an account?",
                login: "Sign in",
                passwordMismatch: "Passwords do not match",
            },
        },
        // Common
        common: {
            loading: "Loading...",
            error: "Error",
            success: "Success",
            cancel: "Cancel",
            save: "Save",
            delete: "Delete",
            edit: "Edit",
            back: "Back",
            next: "Next",
            previous: "Previous",
        },
    },
};
