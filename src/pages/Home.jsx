import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
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
        <main className="home">
            {/* Hero - Asymmetric with overlapping elements */}
            <section className="hero">
                <div className="container">
                    <div className="hero-layout">
                        {/* Large text positioned asymmetrically */}
                        <div className="hero-text">
                            <h1 className="hero-title">
                                <span className="title-line-1">Master</span>
                                <span className="title-line-2">CAT Quant</span>
                            </h1>
                            <div className="hero-subtitle">
                                <span className="percentile">99%ile</span>
                                <p>Not a question bank. A performance platform for structure recognition and pattern mastery.</p>
                            </div>
                        </div>

                        {/* Stats positioned to overlap */}
                        <div className="hero-stats-card">
                            <div className="stat-item">
                                <div className="stat-num">150+</div>
                                <div className="stat-label">Structures</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-num">8</div>
                                <div className="stat-label">Years PYQ</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-num">5s</div>
                                <div className="stat-label">Per Pattern</div>
                            </div>
                        </div>

                        {/* CTA positioned asymmetrically */}
                        <div className="hero-cta">
                            <Link to="/pattern-recognition" className="btn btn-primary btn-large">
                                Try Pattern Training
                            </Link>
                            <Link to="/notes-quiz" className="btn btn-secondary">
                                Notes to Quiz
                            </Link>
                            {/* Arcade Button */}
                            <Link to="/arcade" className="arcade-btn">
                                <span className="arcade-label">fun quant games</span>
                                <span className="arcade-text">Arcade</span>
                            </Link>
                        </div>

                        {/* Decorative shape */}
                        <div className="shape-blob"></div>
                    </div>
                </div>
            </section>

            {/* Features - Overlapping Cards */}
            <section className="features">
                <div className="container">
                    <div className="features-asymmetric">
                        {/* Pattern Training - Top left */}
                        <Link to="/pattern-recognition" className="feature-card feature-medium">
                            <div className="card-tag free">Free</div>
                            <div className="card-content">
                                <div className="card-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                </div>
                                <h3>Pattern Training</h3>
                                <p className="card-lead">5-second recognition drills. Build exam instinct through rapid-fire pattern identification.</p>

                                <div className="card-features">
                                    <div className="card-feature">
                                        <span className="feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <circle cx="12" cy="12" r="6"></circle>
                                                <circle cx="12" cy="12" r="2"></circle>
                                            </svg>
                                        </span>
                                        <span>Timed challenges</span>
                                    </div>
                                    <div className="card-feature">
                                        <span className="feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                                <line x1="6" y1="20" x2="6" y2="14"></line>
                                            </svg>
                                        </span>
                                        <span>Track accuracy</span>
                                    </div>
                                    <div className="card-feature">
                                        <span className="feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 2v6h-6"></path>
                                                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                                                <path d="M3 22v-6h6"></path>
                                                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                                            </svg>
                                        </span>
                                        <span>Adaptive difficulty</span>
                                    </div>
                                </div>

                                <div className="card-stats">
                                    <div className="mini-stat">
                                        <span className="mini-stat-num">50+</span>
                                        <span className="mini-stat-label">Patterns</span>
                                    </div>
                                    <div className="mini-stat">
                                        <span className="mini-stat-num">5s</span>
                                        <span className="mini-stat-label">Per Drill</span>
                                    </div>
                                </div>

                                <div className="card-arrow">Start Training →</div>
                            </div>
                        </Link>

                        {/* Notes Quiz - Top right */}
                        <Link to="/notes-quiz" className="feature-card feature-small">
                            <div className="card-tag free">Free</div>
                            <div className="card-content">
                                <div className="card-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                </div>
                                <h3>Notes Quiz</h3>
                                <p className="card-lead">Transform any notes into personalized quizzes using AI. Active recall made effortless.</p>

                                <div className="card-features">
                                    <div className="card-feature">
                                        <span className="feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                                                <circle cx="7.5" cy="14.5" r="1.5"></circle>
                                                <circle cx="16.5" cy="14.5" r="1.5"></circle>
                                            </svg>
                                        </span>
                                        <span>AI-generated questions</span>
                                    </div>
                                    <div className="card-feature">
                                        <span className="feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                            </svg>
                                        </span>
                                        <span>Any topic/subject</span>
                                    </div>
                                    <div className="card-feature">
                                        <span className="feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                            </svg>
                                        </span>
                                        <span>Instant generation</span>
                                    </div>
                                </div>

                                <div className="card-arrow">Try Now →</div>
                            </div>
                        </Link>

                        {/* Core Structures - Full width hero card */}
                        <div className="feature-card feature-large paid-card">
                            <div className="card-badge">₹799</div>
                            <div className="card-content">
                                <h2>Core Structures</h2>
                                <p className="card-lead">150 handpicked questions representing every recurring CAT pattern.</p>

                                <div className="module-tags">
                                    <span className="tag easy">Easy • 50Q</span>
                                    <span className="tag medium">Medium • 60Q</span>
                                    <span className="tag hard">Hard • 40Q</span>
                                </div>

                                <ul className="feature-list">
                                    <li>Recognition triggers for instant ID</li>
                                    <li>99%iler approach for each type</li>
                                    <li>PYQ examples & patterns</li>
                                </ul>

                                <button className="btn btn-primary btn-full" onClick={() => setShowModal(true)}>
                                    Join Waitlist
                                </button>
                            </div>
                            <div className="card-decoration"></div>
                        </div>

                        {/* Approach card */}
                        <div className="approach-card">
                            <div className="approach-header">
                                <h4>The 99%ile Method</h4>
                                <p className="approach-subtitle">A systematic approach to CAT Quant mastery</p>
                            </div>
                            <div className="approach-steps">
                                <div className="step">
                                    <span className="step-num">01</span>
                                    <div className="step-content">
                                        <span className="step-title">Learn Core Structures</span>
                                        <span className="step-desc">Master the 150 patterns that cover 95% of CAT</span>
                                    </div>
                                </div>
                                <div className="step">
                                    <span className="step-num">02</span>
                                    <div className="step-content">
                                        <span className="step-title">Train Recognition</span>
                                        <span className="step-desc">Build instant pattern identification under pressure</span>
                                    </div>
                                </div>
                                <div className="step">
                                    <span className="step-num">03</span>
                                    <div className="step-content">
                                        <span className="step-title">Execute Precisely</span>
                                        <span className="step-desc">Apply optimal solutions in under 2 minutes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
