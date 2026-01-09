import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, loading, error: authError } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
        if (!formData.email.trim()) {
            newErrors.email = "L'email est obligatoire";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format d'email invalide";
        }
        if (!formData.password) {
            newErrors.password = "Le mot de passe est obligatoire";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!validateForm()) return;

        try {
            await login(formData.email, formData.password);
            navigate("/");
        } catch (err) {
            setErrorMessage(err.message || "Échec de la connexion");
        }
    };

    return (
        <div className="min-h-screen bg-cream dark:bg-chocolate flex items-center justify-center py-12 px-4">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-champagne/30 to-transparent dark:from-espresso/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blush/20 to-transparent dark:from-burgundy/20 pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-8">
                        <span className="font-display text-4xl text-chocolate dark:text-cream">
                            Nailyse
                        </span>
                    </Link>
                    <h1 className="font-display text-3xl text-chocolate dark:text-cream mb-2">
                        Connexion
                    </h1>
                    <p className="font-body text-espresso/60 dark:text-cream/60">
                        Accédez à votre espace personnel
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

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                className={`w-full px-4 py-3 bg-cream dark:bg-chocolate border ${
                                    errors.email
                                        ? "border-red-400"
                                        : "border-espresso/10 dark:border-cream/10"
                                } text-chocolate dark:text-cream font-body focus:outline-none focus:border-wine dark:focus:border-rosegold transition-colors`}
                                placeholder="votre@email.com"
                            />
                            {errors.email && (
                                <p className="mt-2 font-body text-sm text-red-600 dark:text-red-400">
                                    {errors.email}
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
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-cream dark:bg-chocolate border ${
                                    errors.password
                                        ? "border-red-400"
                                        : "border-espresso/10 dark:border-cream/10"
                                } text-chocolate dark:text-cream font-body focus:outline-none focus:border-wine dark:focus:border-rosegold transition-colors`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-2 font-body text-sm text-red-600 dark:text-red-400">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full py-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 disabled:opacity-50"
                        >
                            <span className="relative z-10">
                                {loading ? "Connexion..." : "Se connecter"}
                            </span>
                            <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 pt-6 border-t border-espresso/10 dark:border-cream/10 text-center">
                        <p className="font-body text-sm text-espresso/60 dark:text-cream/60">
                            Pas encore de compte ?{" "}
                            <Link
                                to="/register"
                                className="text-wine dark:text-rosegold hover:underline"
                            >
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-champagne/50 dark:bg-espresso/50 border border-rosegold/20">
                    <p className="font-body text-sm text-chocolate dark:text-cream mb-2">
                        Comptes de démonstration :
                    </p>
                    <ul className="font-body text-xs text-espresso/60 dark:text-cream/60 space-y-1">
                        <li>Admin : admin@nailyse.com / admin123</li>
                        <li>Utilisateur : user@nailyse.com / user123</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
