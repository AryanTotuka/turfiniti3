import { createContext, useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Check for OAuth token in URL params
            const params = new URLSearchParams(window.location.search);
            const tokenFromUrl = params.get('token');
            const oauthError = params.get('error');

            if (tokenFromUrl) {
                localStorage.setItem('token', tokenFromUrl);
                // Clean the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            if (oauthError) {
                console.error('OAuth error:', oauthError);
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            if (localStorage.getItem('token')) {
                try {
                    const res = await api.get('/auth/me');
                    setUser({
                        ...res.data,
                        id: res.data._id,
                        uid: res.data._id
                    });

                    // If we just came from OAuth, navigate to home
                    if (tokenFromUrl) {
                        // Small delay to let the state settle, then redirect
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 100);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser({
                ...res.data.user,
                id: res.data.user.id,
                uid: res.data.user.id
            });
            return res.data.user;
        } catch (error) {
            console.error("Login failed:", error.response?.data?.msg || error.message);
            throw error;
        }
    };

    const loginWithGoogle = () => {
        const getBackendUrl = () => {
            if (import.meta.env.VITE_API_URL) {
                return import.meta.env.VITE_API_URL;
            }
            if (typeof window !== 'undefined' && window.location.port !== '5173') {
                return '/api';
            }
            return 'http://localhost:5000/api';
        };
        const backendUrl = getBackendUrl();
        window.location.href = `${backendUrl}/auth/google`;
    };


    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            localStorage.setItem('token', res.data.token);
            setUser({
                ...res.data.user,
                id: res.data.user.id,
                uid: res.data.user.id
            });
            return res.data.user;
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.msg || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
