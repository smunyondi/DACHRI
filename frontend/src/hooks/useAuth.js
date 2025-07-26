import { useState, useEffect } from 'react';
import { api } from '../utils/api';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const signIn = async (credentials) => {
        try {
            const response = await api.post('/auth/signin', credentials);
            setUser(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const signUp = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            setUser(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (err) {
            setError(err);
        }
    };

    return {
        user,
        loading,
        error,
        signIn,
        signUp,
        logout,
    };
};

export default useAuth;