import { supabase } from '../lib/supabase';

const AUTH_KEY = 'quantninja_user';
const WAITLIST_TABLE = 'waitlist';

// Helper to extract name from email
function extractNameFromEmail(email) {
    const localPart = email.split('@')[0];
    return localPart
        .replace(/[._-]/g, ' ')
        .replace(/\d+/g, '')
        .trim() || 'Anonymous';
}

// Function to sync user to waitlist table
const syncToWaitlist = async (email, name, source) => {
    if (!supabase) return;

    try {
        const { error } = await supabase
            .from(WAITLIST_TABLE)
            .upsert(
                {
                    name: name,
                    email: email.toLowerCase().trim(),
                    source: source,
                    created_at: new Date().toISOString(),
                },
                {
                    onConflict: 'email',
                    ignoreDuplicates: false
                }
            );

        if (error) console.error('Error syncing to waitlist:', error);
    } catch (err) {
        console.error('Unexpected error syncing to waitlist:', err);
    }
};

// Initialize Supabase auth listener
if (supabase) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            const googleName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
            const fallbackName = extractNameFromEmail(session.user.email);
            const user = {
                email: session.user.email,
                name: googleName || fallbackName,
                signedInAt: new Date().toISOString(),
                initial: (googleName || fallbackName).charAt(0).toUpperCase(),
                id: session.user.id
            };

            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            window.dispatchEvent(new Event('storage'));

            // Auto-add to waitlist table
            await syncToWaitlist(user.email, user.name, 'google-auth');
        } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem(AUTH_KEY);
            window.dispatchEvent(new Event('storage'));
        }
    });
}

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

export const signIn = async (email) => {
    const name = extractNameFromEmail(email);
    const user = {
        email: email.toLowerCase().trim(),
        name: name,
        signedInAt: new Date().toISOString(),
        initial: name.charAt(0).toUpperCase()
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));

    // Attempt to sync to waitlist even for manual email sign-in
    await syncToWaitlist(user.email, user.name, 'email-auth');

    return user;
};

export const signInWithGoogle = async () => {
    if (supabase) {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
        return data;
    } else {
        // Mock Google Sign-In for development
        console.warn('Supabase not configured. Using mock Google sign-in.');
        const mockUser = await signIn('google.user@example.com');
        return { user: mockUser };
    }
};

export const signOut = async () => {
    if (supabase) {
        await supabase.auth.signOut();
    }
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event('storage'));
};

export const getUserInitial = () => {
    const user = getUser();
    return user ? user.initial : null;
};

export const getUserEmail = () => {
    const user = getUser();
    return user ? user.email : null;
};

