import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-main">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo-link">
                            <img src="/logo.jpg" alt="QuantNinja" className="footer-logo" />
                            <span className="footer-title">QuantNinja</span>
                        </Link>
                        <p className="footer-tagline">
                            Master CAT Quant. Score 99 Percentile.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>Platform</h4>
                            <ul>
                                <li><Link to="/course">Core Structures</Link></li>
                                <li><Link to="/pattern-recognition">Pattern Training</Link></li>
                                <li><Link to="/notes-quiz">Notes Quiz</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="#">CAT Quant Guide</a></li>
                                <li><a href="#">Study Tips</a></li>
                                <li><a href="#">FAQs</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Connect</h4>
                            <ul>
                                <li><a href="#">Twitter</a></li>
                                <li><a href="#">LinkedIn</a></li>
                                <li><a href="#">Telegram</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} QuantNinja. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
