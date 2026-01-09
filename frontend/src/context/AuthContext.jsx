import { createContext, useContext, useEffect, useState } from "react";

/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the React application.
 * Handles user login, logout, registration, and token management.
 *
 * Features:
 * - Persistent authentication via localStorage
 * - Automatic token refresh
 * - User state management
 * - Protected route support
 *
 * @author Nailyse Team
 */

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Create the authentication context
const AuthContext = createContext();

/**
 * Authentication Provider Component
 *
 * Wraps the application and provides authentication functionality to all children.
 * Automatically restores authentication state from localStorage on mount.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const AuthProvider = ({ children }) => {
    // ========== State Management ==========

    /**
     * Current authenticated user object
     * Contains: id, email, fullName, roles, isAdmin
     * Null if not authenticated
     */
    const [user, setUser] = useState(null);

    /**
     * Authentication token (Bearer token)
     * Used for API requests requiring authentication
     */
    const [token, setToken] = useState(null);

    /**
     * Loading state for async authentication operations
     * True during login, logout, registration, or token verification
     */
    const [loading, setLoading] = useState(true);

    /**
     * Error message from last authentication operation
     * Null if no error
     */
    const [error, setError] = useState(null);

    // ========== Effect: Restore Authentication on Mount ==========

    /**
     * Restore user session from localStorage on component mount
     * Runs once when the AuthProvider is first rendered
     */
    useEffect(() => {
        const storedUser = localStorage.getItem("nailyse_user");
        const storedToken = localStorage.getItem("nailyse_token");

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (err) {
                // Clear invalid data
                localStorage.removeItem("nailyse_user");
                localStorage.removeItem("nailyse_token");
            }
        }

        setLoading(false);
    }, []);

    // ========== Authentication Methods ==========

    /**
     * Login user with email and password
     *
     * Sends credentials to backend API and stores user data + token on success.
     *
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Promise<Object>} Login response with user data
     * @throws {Error} If login fails
     */
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Échec de la connexion");
            }

            // Store user and token
            setUser(data.user);
            setToken(data.token);

            // Persist to localStorage
            localStorage.setItem("nailyse_user", JSON.stringify(data.user));
            localStorage.setItem("nailyse_token", data.token);

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register a new user account
     *
     * Creates new account and automatically logs in the user on success.
     *
     * @param {Object} userData - User registration data
     * @param {string} userData.email - Email address
     * @param {string} userData.fullName - Full name
     * @param {string} userData.password - Password
     * @param {string} [userData.phone] - Phone number (optional)
     * @returns {Promise<Object>} Registration response with user data
     * @throws {Error} If registration fails
     */
    const register = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Échec de l'inscription");
            }

            // Auto-login after successful registration
            setUser(data.user);
            setToken(data.token);

            // Persist to localStorage
            localStorage.setItem("nailyse_user", JSON.stringify(data.user));
            localStorage.setItem("nailyse_token", data.token);

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout current user
     *
     * Clears user data, token, and localStorage.
     * Redirects to home page.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        setError(null);

        // Clear localStorage
        localStorage.removeItem("nailyse_user");
        localStorage.removeItem("nailyse_token");
    };

    /**
     * Make authenticated API request
     *
     * Helper function to make API calls with authentication token.
     *
     * @param {string} endpoint - API endpoint (e.g., "/api/products")
     * @param {Object} [options={}] - Fetch options (method, body, etc.)
     * @returns {Promise<Object>} Response data
     * @throws {Error} If request fails or user not authenticated
     */
    const authenticatedFetch = async (endpoint, options = {}) => {
        if (!token) {
            throw new Error("Vous devez être connecté pour effectuer cette action");
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            // If unauthorized, logout user
            if (response.status === 401) {
                logout();
                throw new Error("Session expirée. Veuillez vous reconnecter.");
            }

            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la requête");
        }

        return response.json();
    };

    /**
     * Check if current user is authenticated
     *
     * @returns {boolean} True if user is logged in
     */
    const isAuthenticated = () => {
        return user !== null && token !== null;
    };

    /**
     * Check if current user is admin
     *
     * @returns {boolean} True if user has admin role
     */
    const isAdmin = () => {
        return user?.isAdmin === true;
    };

    // ========== Context Value ==========

    const value = {
        // State
        user,
        token,
        loading,
        error,

        // Methods
        login,
        register,
        logout,
        authenticatedFetch,
        isAuthenticated,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use authentication context
 *
 * Must be used within an AuthProvider.
 *
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside AuthProvider
 *
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
