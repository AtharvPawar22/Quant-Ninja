/**
 * Auth Service for QuantNinja
 * Handles email-based authentication with localStorage persistence.
 */

const AUTH_KEY = 'quantninja_user';

export const getUser = () => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    return getUser() !== null;
};

export const signIn = (email) => {
    const user = {
        email: email.toLowerCase().trim(),
        signedInAt: new Date().toISOString(),
        initial: email.charAt(0).toUpperCase()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
};

export const signOut = () => {
    localStorage.removeItem(AUTH_KEY);
};

export const getUserInitial = () => {
    const user = getUser();
    return user ? user.initial : null;
};

export const getUserEmail = () => {
    const user = getUser();
    return user ? user.email : null;
};
