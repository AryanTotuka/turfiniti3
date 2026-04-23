import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const res = await api.get('/auth/me');
                    setUser({
                        ...res.data,
                        id: res.data._id,
                        uid: res.data._id
                    });
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
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
