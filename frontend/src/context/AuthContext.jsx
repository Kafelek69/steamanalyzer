import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/auth/session', {
            withCredentials: true
        })
        .then(response => {
            if (response.data.authenticated) {
                const userData = response.data.user;
                const storedBalance = localStorage.getItem('balance_' + userData.steam_id);
                userData.balance = storedBalance ? parseFloat(storedBalance) : 500.00;
                
                const storedTransactions = localStorage.getItem('transactions_' + userData.steam_id);
                if (storedTransactions) {
                    let parsed = JSON.parse(storedTransactions);
                    // Filter out mock data if it was accidentally saved
                    parsed = parsed.filter(t => !['tx-001', 'tx-002', 'tx-003', 'tx-004'].includes(t.id));
                    userData.transactions = parsed;
                    localStorage.setItem('transactions_' + userData.steam_id, JSON.stringify(parsed));
                } else {
                    userData.transactions = [];
                }
                
                setUser(userData);
            }
        })
        .catch(err => {
            console.log('Nie zalogowano na starcie');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    const loginWithSteam = () => {
        window.location.href = 'http://localhost:5000/api/auth/steam';
    };

    const logout = () => {
        window.location.href = 'http://localhost:5000/api/auth/logout';
    };

    const updateBalance = (amount) => {
        if (user) {
            const newBalance = parseFloat(user.balance) + parseFloat(amount);
            setUser({ ...user, balance: newBalance });
            localStorage.setItem('balance_' + user.steam_id, newBalance);
            return newBalance;
        }
        return 0;
    };

    const addTransaction = (type, item, price) => {
        if (user) {
            const newTx = {
                id: 'tx-' + Date.now().toString(),
                type,
                item,
                price: parseFloat(price),
                date: new Date().toISOString().split('T')[0]
            };
            const updatedTransactions = [newTx, ...user.transactions];
            setUser((prev) => ({ ...prev, transactions: updatedTransactions }));
            localStorage.setItem('transactions_' + user.steam_id, JSON.stringify(updatedTransactions));
        }
    };

    const clearTransactions = () => {
        if (user) {
            setUser((prev) => ({ ...prev, transactions: [] }));
            localStorage.setItem('transactions_' + user.steam_id, JSON.stringify([]));
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithSteam, logout, updateBalance, addTransaction, clearTransactions }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
