import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register, loading, error: authError } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Le nom complet est obligatoire";
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = "Le nom doit contenir au moins 2 caractères";
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est obligatoire";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (formData.phone && !/^[0-9+\s\.\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = "Format de téléphone invalide";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est obligatoire";
        } else if (formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!validateForm()) return;

        try {
            const userData = {
                email: formData.email,
                fullName: formData.fullName,
                password: formData.password,
            };
            if (formData.phone) {
                userData.phone = formData.phone;
            }
            await register(userData);
            navigate("/");
        } catch (err) {
            setErrorMessage(err.message || "Échec de l'inscription");
        }
    };

    const inputClass = (fieldName) =>
        `w-full px-4 py-3 bg-cream dark:bg-chocolate border ${
            errors[fieldName]
                ? "border-red-400"
                : "border-espresso/10 dark:border-cream/10"
        } text-chocolate dark:text-cream font-body focus:outline-none focus:border-wine dark:focus:border-rosegold transition-colors`;

    return (
        <div className="min-h-screen bg-cream dark:bg-chocolate flex items-center justify-center py-12 px-4">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blush/20 to-transparent dark:from-burgundy/20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-champagne/30 to-transparent dark:from-espresso/30 pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-8">
                        <span className="font-display text-4xl text-chocolate dark:text-cream">
                            Nailyse
                        </span>
                    </Link>
                    <h1 className="font-display text-3xl text-chocolate dark:text-cream mb-2">
                        Créer un compte
                    </h1>
                    <p className="font-body text-espresso/60 dark:text-cream/60">
                        Rejoignez notre communauté
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-espresso p-8 md:p-10">
                    {/* Error Message */}
                    {(errorMessage || authError) && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 font-body text-sm">
                            {errorMessage || authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60 mb-2">
                                Nom complet
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                autoComplete="name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={inputClass("fullName")}
                                placeholder="Marie Dubois"
                            />
                            {errors.fullName && (
                                <p className="mt-2 font-body text-sm text-red-600 dark:text-red-400">
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass("email")}
                                placeholder="marie@example.com"
                            />
                            {errors.email && (
                                <p className="mt-2 font-body text-sm text-red-600 dark:text-red-400">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60 mb-2">
                                Téléphone{" "}
                                <span className="normal-case text-espresso/40 dark:text-cream/40">
                                    (optionnel)
                                </span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                autoComplete="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClass("phone")}
                                placeholder="+33 6 12 34 56 78"
                            />
                            {errors.phone && (
                                <p className="mt-2 font-body text-sm text-red-600 dark:text-red-400">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                className={inputClass("password")}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-2 font-body text-sm text-red-600 dark:text-red-400">
                                    {errors.password}
                                </p>
                            )}
                            <p className="mt-1 font-body text-xs text-espresso/40 dark:text-cream/40">
                                Minimum 8 caractères
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={inputClass("confirmPassword")}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-2 font-body text-sm text-red-600 dark:text-red-400">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full py-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 disabled:opacity-50 mt-8"
                        >
                            <span className="relative z-10">
                                {loading ? "Création..." : "Créer mon compte"}
                            </span>
                            <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-espresso/10 dark:border-cream/10 text-center">
                        <p className="font-body text-sm text-espresso/60 dark:text-cream/60">
                            Déjà un compte ?{" "}
                            <Link
                                to="/login"
                                className="text-wine dark:text-rosegold hover:underline"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
