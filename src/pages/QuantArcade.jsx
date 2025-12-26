import { Link } from 'react-router-dom';
import '../styles/animations.css';
import './QuantArcade.css';

export default function QuantArcade() {
    return (
        <main className="arcade-page fade-in">
            <div className="ink-wash"></div>
            <div className="arcade-container">
                <div className="arcade-header fade-in-up">
                    <Link to="/" className="back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"></path>
                        </svg>
                        <span>Return to Study</span>
                    </Link>
                    <h1 className="arcade-title">Quantitative Arcade</h1>
                    <p className="arcade-subtitle">Battle-tested drills to sharpen your instinctive responses</p>
                </div>

                <section className="battle-modes fade-in-up delay-1">
                    <h2 className="section-label">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="label-icon">
                            <path d="M14.5 2L20 7.5L7.5 20L2 14.5L14.5 2Z"></path>
                            <path d="M12 11.5L4 19.5"></path>
                            <path d="M15 8.5L20 3.5"></path>
                        </svg>
                        Battle Modes
                    </h2>

                    <div className="mode-cards">
                        {/* Classic 1v1 */}
                        <div className="mode-card glass hover-lift">
                            <div className="mode-icon-wrapper classic-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                            </div>
                            <div className="mode-info">
                                <div className="mode-title-row">
                                    <h3 className="mode-title">Classic 1v1</h3>
                                    <span className="mode-badge live">Live Session</span>
                                </div>
                                <p className="mode-desc">Real-time quantitative combat • 60 seconds per structure</p>
                            </div>
                            <Link to="/arcade/classic-1v1" className="play-btn btn-shine">
                                <span>Duel</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="arcade-stats fade-in-up delay-2">
                    <div className="stat-card glass hover-lift">
                        <div className="stat-icon-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                                <path d="M6 12h4m-2-2v4m7-4h.01m2.99 4h.01"></path>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Battles</span>
                        </div>
                    </div>
                    <div className="stat-card glass hover-lift">
                        <div className="stat-icon-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 15l-2 5L9 9l11 4-5 2zm0 0l4 4"></path>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Victories</span>
                        </div>
                    </div>
                    <div className="stat-card glass hover-lift">
                        <div className="stat-icon-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">--</span>
                            <span className="stat-label">Efficiency</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
