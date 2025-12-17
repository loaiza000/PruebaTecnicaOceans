import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.message || 'error al iniciar sesion');
            }

            const userData = {
                id: data.data.id,
                email: data.data.email,
                nombre: data.data.nombre,
                rol: data.data.rol,
            };

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.data.token);
            setUser(userData);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAdmin = () => {
        return user?.rol === 'admin';
    };

    const isMesero = () => {
        return user?.rol === 'mesero';
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin,
        isMesero,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
