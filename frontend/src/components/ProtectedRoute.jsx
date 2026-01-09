import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protected Route Component
 *
 * Wrapper component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 * Optionally restricts access to admin users only.
 *
 * Features:
 * - Authentication check
 * - Admin role check (optional)
 * - Automatic redirect to login
 * - Loading state handling
 *
 * @author Nailyse Team
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {boolean} [props.adminOnly=false] - If true, only admins can access
 * @returns {JSX.Element} Children if authorized, or redirect to login
 *
 * @example
 * // Protect a route for authenticated users
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * @example
 * // Protect a route for admins only
 * <ProtectedRoute adminOnly={true}>
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Chargement...
                    </p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to home if admin access required but user is not admin
    if (adminOnly && !isAdmin()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
                            Accès refusé
                        </h2>
                        <p className="text-red-600 dark:text-red-300">
                            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        </p>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Cette page est réservée aux administrateurs.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Render children if authorized
    return children;
}
