import { useState } from 'react';
import { saveEmailToWaitlist } from '../services/emailService';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await saveEmailToWaitlist(email, {
                name: name.trim(),
                source: 'signup_modal',
            });

            setIsSubmitting(false);

            if (result.success) {
                setSubmitted(true);
                
                // Create a simple user object for local state
                const user = {
                    email: email.toLowerCase().trim(),
                    name: name.trim(),
                    signedInAt: new Date().toISOString(),
                    initial: name.trim().charAt(0).toUpperCase()
                };
                
                // Store in localStorage for UI purposes
                localStorage.setItem('quantninja_user', JSON.stringify(user));
                window.dispatchEvent(new Event('storage'));

                // Wait a moment to show success, then close
                setTimeout(() => {
                    setName('');
                    setEmail('');
                    setSubmitted(false);
                    if (onSuccess) {
                        onSuccess(user);
                    }
                    onClose();
                }, 1500);
            } else {
                setError(result.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to sign up. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
            onClose();
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={handleBackdropClick}>
            <div className="auth-modal glass">
                <button className="auth-modal-close" onClick={onClose} disabled={isSubmitting}>✕</button>

                <div className="auth-brand-mark">
                    <div className="mark-line"></div>
                </div>

                {!submitted ? (
                    <>
                        <h2 className="auth-modal-title">Join the Dojo</h2>
                        <p className="auth-modal-subtitle">Get early access & exclusive updates</p>

                        <form onSubmit={handleSubmit} className="auth-modal-form">
                            <div className="auth-input-wrapper">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="auth-modal-input"
                                    required
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                            </div>

                            <div className="auth-input-wrapper">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="auth-modal-input"
                                    required
                                    disabled={isSubmitting}
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
                                    'Join Waitlist'
                                )}
                            </button>
                        </form>

                        <p className="auth-modal-note">
                            Be the first to know when new features launch.
                        </p>
                    </>
                ) : (
                    <div className="auth-success-state">
                        <div className="success-icon-large">✓</div>
                        <h3>You're on the list!</h3>
                        <p>We'll notify you when we launch.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
