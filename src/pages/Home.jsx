import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/animations.css';
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
            <div className="ink-wash"></div>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-layout">
                        <div className="hero-content fade-in-up">
                            <div className="hero-badge fade-in delay-1">
                                <span className="brush-underline">Master CAT Quant</span>
                            </div>
                            <h1 className="hero-title">
                                <span className="title-scholar">The Scholar's</span>
                                <span className="title-ninja">Ninja Path</span>
                            </h1>
                            <div className="hero-subtitle">
                                <div className="percentile-box">
                                    <span className="percentile-num">99</span>
                                    <span className="percentile-label">%ile</span>
                                </div>
                                <p>A precision performance platform for structure recognition and obsessive pattern mastery. Not just a question bank—an instinct builder.</p>
                            </div>

                            <div className="hero-cta fade-in delay-2">
                                <Link to="/pattern-recognition" className="btn btn-primary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                    <span>Begin Training</span>
                                </Link>
                                <Link to="/notes-quiz" className="btn btn-secondary btn-shimmer">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                    </svg>
                                    <span>Notes to Quiz</span>
                                </Link>
                            </div>
                        </div>

                        <div className="hero-visual fade-in delay-3">

                            <div className="stats-grid">
                                <div className="stat-card glass hover-lift">
                                    <span className="stat-value">150+</span>
                                    <span className="stat-label">Core Patterns</span>
                                </div>
                                <div className="stat-card glass hover-lift">
                                    <span className="stat-value">8yrs</span>
                                    <span className="stat-label">PYQ Insight</span>
                                </div>
                                <div className="stat-card glass hover-lift">
                                    <span className="stat-value">5s</span>
                                    <span className="stat-label">Response Goal</span>
                                </div>
                            </div>
                            <div className="floating-elements">
                                <div className="float-shape shape-1"></div>
                                <div className="float-shape shape-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="section-header fade-in">
                        <h2 className="section-title">Mastery Modules</h2>
                        <p className="section-subtitle">Disciplined tools for the serious aspirant</p>
                    </div>

                    <div className="features-grid">
                        {/* Pattern Training */}
                        <Link to="/pattern-recognition" className="feature-card glass hover-lift fade-in delay-1">
                            <div className="card-tag">Free</div>
                            <div className="card-icon-wrapper">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                </svg>
                            </div>
                            <h3>Pattern Drills</h3>
                            <p>Build instant recognition with 5-second rapid-fire drills. The goal isn't solving—it's knowing exactly how to solve.</p>
                            <div className="card-footer">
                                <span className="btn-text">Enter Dojo</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </Link>

                        {/* AI Notes Quiz */}
                        <Link to="/notes-quiz" className="feature-card glass hover-lift fade-in delay-2">
                            <div className="card-tag">Free</div>
                            <div className="card-icon-wrapper">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                    <path d="M9 14l2 2 4-4"></path>
                                </svg>
                            </div>
                            <h3>Active Recall</h3>
                            <p>Convert your notes into focused quizzes instantly using AI. Challenge your understanding of any topic in seconds.</p>
                            <div className="card-footer">
                                <span className="btn-text">Test Yourself</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </Link>

                        {/* Core Structures - Premium */}
                        <div className="feature-card glass focus-card fade-in delay-3">
                            <div className="card-tag premium">Premium</div>
                            <div className="card-content">
                                <h3>Core Structures</h3>
                                <p>150 handpicked questions covering every recurring CAT pattern across three difficulty modules.</p>
                                <div className="difficulty-pills">
                                    <span className="pill easy">Easy • 50</span>
                                    <span className="pill medium">Medium • 60</span>
                                    <span className="pill hard">Hard • 40</span>
                                </div>
                                <button className="btn btn-primary btn-shine" onClick={() => setShowModal(true)}>
                                    Join the Inner Circle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Approach */}
            <section className="approach">
                <div className="container">
                    <div className="approach-box glass">
                        <div className="approach-content">
                            <h3>The Ninja-Scholar Method</h3>
                            <div className="steps-container">
                                <div className="approach-step">
                                    <span className="step-num">一</span>
                                    <div className="step-info">
                                        <h4>Observe</h4>
                                        <p>Learn the trigger points for every major structure.</p>
                                    </div>
                                </div>
                                <div className="approach-step">
                                    <span className="step-num">二</span>
                                    <div className="step-info">
                                        <h4>Train</h4>
                                        <p>Build instinctive response under extreme pressure.</p>
                                    </div>
                                </div>
                                <div className="approach-step">
                                    <span className="step-num">三</span>
                                    <div className="step-info">
                                        <h4>Master</h4>
                                        <p>Execute the 99%ile approach in under 120 seconds.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Arcade Link Section */}
            <section className="arcade-cta container">
                <Link to="/arcade" className="arcade-banner glass hover-lift">
                    <div className="arcade-banner-content">
                        <span className="banner-tag">Training Dojo</span>
                        <h2>Quantitative Arcade</h2>
                        <p>Sharpen your reflexes with real-time battle modes</p>
                    </div>
                    <div className="arcade-banner-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                            <path d="M6 12h4m-2-2v4m7-4h.01m2.99 4h.01"></path>
                        </svg>
                    </div>
                </Link>
            </section>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal glass fade-in" onClick={(e) => e.stopPropagation()}>
                        {!submitted ? (
                            <>
                                <h3 className="modal-title">Ascend to Mastery</h3>
                                <p>Be the first to access the complete 150-pattern repository.</p>
                                <form onSubmit={handleSubmit} className="modal-form">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="modal-input"
                                    />
                                    <button type="submit" className="btn btn-primary btn-shine">
                                        Secure Early Access
                                    </button>
                                </form>
                                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                            </>
                        ) : (
                            <div className="success">
                                <div className="success-icon">✓</div>
                                <p>A Scholar has been registered. We shall notify you.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
