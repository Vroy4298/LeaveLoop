import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('hr_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const savedToken = localStorage.getItem('hr_token');
            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await API.get('/auth/me');
                setUser(data.user);   // this matches backend now
            } catch (error) {
                localStorage.removeItem('hr_token');
                localStorage.removeItem('hr_user');
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });

        localStorage.setItem('hr_token', data.token);
        localStorage.setItem('hr_user', JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data.user;
    };

    const register = async (formData) => {
        const { data } = await API.post('/auth/register', formData);

        localStorage.setItem('hr_token', data.token);
        localStorage.setItem('hr_user', JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('hr_token');
        localStorage.removeItem('hr_user');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};