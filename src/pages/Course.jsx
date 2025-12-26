import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Course.css';

export default function Course() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setShowModal(false);
            setSubmitted(false);
            setEmail('');
        }, 2000);
    };

    return (
        <main className="course-page">
            <div className="ink-wash"></div>
            <div className="container">
                <div className="page-header">
                    <Link to="/" className="back-link">← Back</Link>
                    <h1>Core Structures</h1>
                    <p>150 curated questions covering the CAT Quant space</p>
                </div>

                {/* Locked State */}
                <div className="locked-content">
                    <div className="lock-icon">🔒</div>
                    <h2>This is a Paid Course</h2>
                    <p className="lock-desc">
                        Get access to 150 handpicked questions representing every recurring pattern in CAT Quant.
                        Organized by difficulty with recognition triggers and 99%iler approaches.
                    </p>

                    <div className="pricing-card">
                        <div className="price-header">
                            <div className="price-tag-large">₹799</div>
                            <span className="price-label">One-time payment</span>
                        </div>

                        <div className="whats-included">
                            <h3>What's Included</h3>
                            <div className="included-list">
                                <div className="included-item">
                                    <span className="check-icon">✓</span>
                                    <span>50 Easy structures (Speed builders)</span>
                                </div>
                                <div className="included-item">
                                    <span className="check-icon">✓</span>
                                    <span>60 Medium structures (99%ile makers)</span>
                                </div>
                                <div className="included-item">
                                    <span className="check-icon">✓</span>
                                    <span>40 Hard structures (Decision discipline)</span>
                                </div>
                                <div className="included-item">
                                    <span className="check-icon">✓</span>
                                    <span>Recognition triggers for each pattern</span>
                                </div>
                                <div className="included-item">
                                    <span className="check-icon">✓</span>
                                    <span>PYQ examples and 99%iler approach</span>
                                </div>
                                <div className="included-item">
                                    <span className="check-icon">✓</span>
                                    <span>Lifetime access with updates</span>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-full" onClick={() => setShowModal(true)}>
                            Join Waitlist
                        </button>
                    </div>

                    <div className="preview-note">
                        <span>💡 Join the waitlist to get early access when we launch</span>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        {!submitted ? (
                            <>
                                <h3>Join the Waitlist</h3>
                                <p>We'll notify you when Core Structures launches.</p>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary btn-full">
                                        Get Early Access
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="success">
                                <div className="success-icon">✓</div>
                                <p>You're on the list! We'll notify you soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
