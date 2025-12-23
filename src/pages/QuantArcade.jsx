import { Link } from 'react-router-dom';
import './QuantArcade.css';

export default function QuantArcade() {
    return (
        <main className="arcade-page">
            <div className="arcade-container">
                <div className="arcade-header">
                    <Link to="/" className="back-link">← Back to Home</Link>
                    <h1 className="arcade-title">Quant Arcade</h1>
                    <p className="arcade-subtitle">Battle modes to sharpen your quant skills</p>
                </div>

                <section className="battle-modes">
                    <h2 className="section-label">
                        <span className="label-icon">⚔️</span>
                        Battle Modes
                    </h2>

                    <div className="mode-cards">
                        {/* Classic 1v1 */}
                        <div className="mode-card">
                            <div className="mode-icon classic-icon">
                                <span>⚡</span>
                            </div>
                            <div className="mode-info">
                                <div className="mode-title-row">
                                    <h3 className="mode-title">Classic 1v1</h3>
                                    <span className="mode-badge live">LIVE</span>
                                </div>
                                <p className="mode-desc">Real-time quantitative battles • 60s per question</p>
                            </div>
                            <Link to="/arcade/classic-1v1" className="play-btn">
                                <span className="play-icon">▶</span>
                                Play
                            </Link>
                        </div>


                    </div>
                </section>

                <section className="arcade-stats">
                    <div className="stat-card">
                        <span className="stat-icon">🎮</span>
                        <div className="stat-content">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Games Played</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🏆</span>
                        <div className="stat-content">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Wins</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">📈</span>
                        <div className="stat-content">
                            <span className="stat-value">--</span>
                            <span className="stat-label">Win Rate</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
