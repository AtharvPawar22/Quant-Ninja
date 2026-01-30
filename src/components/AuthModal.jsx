import { useState } from 'react';
import { signIn, signInWithGoogle } from '../services/authService';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            const result = await signInWithGoogle();
            // result might contain 'user' in mock mode or 'url' in real Supabase mode
            if (result && result.user) {
                if (onSuccess) onSuccess(result.user);
                onClose();
            }
            // In real mode, it redirects, so we don't necessarily need to handle success here
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        // Simulate a brief delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const user = await signIn(email);
            setIsSubmitting(false);
            setEmail('');

            if (onSuccess) {
                onSuccess(user);
            }
            onClose();
        } catch (err) {
            setError('Authentication failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={handleBackdropClick}>
            <div className="auth-modal glass">
                <button className="auth-modal-close" onClick={onClose}>✕</button>

                <div className="auth-brand-mark">
                    <div className="mark-line"></div>
                </div>

                <h2 className="auth-modal-title">Authentication</h2>
                <p className="auth-modal-subtitle">Secure your progress within the Dojo</p>

                <div className="auth-social-area">
                    <button
                        className="google-auth-btn"
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#EA4335" d="M5.2662 9.7645C6.199 6.9386 8.8545 4.9091 12 4.9091C13.6909 4.9091 15.2182 5.5091 16.4182 6.4909L19.9091 3C17.7818 1.14545 15.0545 0 12 0C7.27273 0 3.19091 2.69091 1.24091 6.6227L5.2662 9.7645Z" />
                            <path fill="#FBBC04" d="M16.0409 18.0136C14.8727 18.7227 13.5182 19.1364 12 19.1364C8.8545 19.1364 6.199 17.1068 5.2662 14.2809L1.24091 17.4227C3.19091 21.3545 7.27273 24.0455 12 24.0455C15.0545 24.0455 17.7818 23.0545 19.9364 21.3136L16.0409 18.0136Z" />
                            <path fill="#4285F4" d="M19.8273 21.7091C22.4636 19.5364 24 16.5182 24 12C24 11.2364 23.9318 10.4727 23.7955 9.73636H12V14.5091H18.7864C18.4909 16.0682 17.6591 17.3091 16.4182 18.1455L19.8273 21.7091Z" />
                            <path fill="#34A853" d="M1.24091 6.6227L5.2662 9.7645C6.199 12.5905 8.8545 14.6191 12 14.6191C13.3818 14.6191 14.6618 14.2364 15.7482 13.5786L19.1323 16.2903C21.4118 14.5459 22.8427 11.751 22.8427 8.52055L1.24091 6.6227Z" style={{ display: 'none' }} />
                            <path fill="#34A853" d="M16.0409 18.0136L19.8273 21.7091C22.4636 19.5364 24 16.5182 24 12C24 11.2364 23.9318 10.4727 23.7955 9.73636H12V14.5091H18.7864C18.4909 16.0682 17.6591 17.3091 16.4182 18.1455L16.0409 18.0136Z" style={{ display: 'none' }} />
                            <path fill="#34A853" d="M5.2664 14.2461C5.088 13.5182 5 12.7682 5 12C5 11.2318 5.088 10.4818 5.2664 9.75382L1.24111 6.61182C0.44747 8.24182 0 10.0682 0 12C0 13.9318 0.44747 15.7582 1.24111 17.3882L5.2664 14.2461Z" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-modal-form">
                    <div className="auth-input-wrapper">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="auth-modal-input"
                            required
                            disabled={isSubmitting}
                            autoFocus
                        />
                        {error && <span className="auth-error">{error}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-shine auth-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="auth-loading">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </span>
                        ) : (
                            'Continue'
                        )}
                    </button>
                </form>

                <p className="auth-modal-note">
                    By continuing, you facilitate progress tracking for your training.
                </p>
            </div>
        </div>
    );
}

