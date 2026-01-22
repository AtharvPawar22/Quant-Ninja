import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import coreStructures from '../data/coreStructures';
import {
    getProgress,
    markQuestionAttempted,
    toggleBookmark,
    isBookmarked,
    getStats
} from '../services/progressService';
import './Course.css';
import './NotesQuiz.css'; // Reuse CAT UI styles

// Dev emails that bypass the waitlist for testing
const DEV_EMAILS = ['xyz111@email.com', 'admin@quantninja.com'];

const TOPICS = [
    { id: 'arithmetic', name: 'Arithmetic', icon: '🔢', count: 65 },
    { id: 'algebra', name: 'Algebra', icon: '📈', count: 42 },
    { id: 'geometry', name: 'Geometry', icon: '📐', count: 22 },
    { id: 'numberSystem', name: 'Number System', icon: '🔢', count: 11 },
    { id: 'modernMath', name: 'Modern Math', icon: '🎲', count: 10 }
];

export default function Course() {
    // Access Control
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);

    // Stage Management
    const [stage, setStage] = useState('browse'); // browse, preview, quiz, result

    // Filter State
    const [filters, setFilters] = useState({
        topic: 'All',
        difficulty: 'All',
        showCompleted: true,
        showBookmarked: false
    });

    // Practice State
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [titaInputs, setTitaInputs] = useState({});
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimed, setIsTimed] = useState(true);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [showNinjaHint, setShowNinjaHint] = useState({});

    // Progress State
    const [progress, setProgress] = useState(getProgress());
    const stats = getStats(coreStructures.questions);

    // Timer Effect
    useEffect(() => {
        if (stage !== 'quiz' || !isTimed || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleQuizSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [stage, isTimed, timeLeft]);

    // UI Effects - Hide Navbar/Footer during Quiz
    useEffect(() => {
        const navbar = document.querySelector('.navbar');
        const footer = document.querySelector('.footer');

        if (stage === 'quiz') {
            if (navbar) navbar.style.display = 'none';
            if (footer) footer.style.display = 'none';
            document.body.style.paddingTop = '0';
        } else {
            if (navbar) navbar.style.display = '';
            if (footer) footer.style.display = '';
            document.body.style.paddingTop = '';
        }

        return () => {
            if (navbar) navbar.style.display = '';
            if (footer) footer.style.display = '';
            document.body.style.paddingTop = '';
        };
    }, [stage]);

    // Handle Access
    const handleAccessSubmit = (e) => {
        e.preventDefault();
        if (DEV_EMAILS.includes(email.toLowerCase())) {
            setHasAccess(true);
            setShowModal(false);
            return;
        }
        setSubmitted(true);
        setTimeout(() => {
            setShowModal(false);
            setSubmitted(false);
            setEmail('');
        }, 2000);
    };

    // Filter Logic
    const getFilteredQuestions = () => {
        return coreStructures.questions.filter(q => {
            const topicMatch = filters.topic === 'All' || q.topic === filters.topic;
            const diffMatch = filters.difficulty === 'All' || q.difficulty === filters.difficulty;
            const statusMatch = filters.showCompleted || !progress.attempted[q.id];
            const bookmarkMatch = !filters.showBookmarked || isBookmarked(q.id);
            return topicMatch && diffMatch && statusMatch && bookmarkMatch;
        });
    };

    // Navigation
    const startPractice = (qs) => {
        setSelectedQuestions(qs);
        setCurrentQ(0);
        setAnswers({});
        setTitaInputs({});
        setMarkedForReview(new Set());
        setVisitedQuestions(new Set([0]));
        setTimeLeft(qs.length * 120); // 2 mins per question
        setStage('preview');
    };

    const enterQuiz = () => {
        setStage('quiz');
    };

    const handleQuizSubmit = () => {
        setShowSubmitConfirm(false);
        setStage('result');
        // Save results to progress
        selectedQuestions.forEach((q, i) => {
            const userAnswer = answers[i];
            if (userAnswer !== undefined) {
                const isCorrect = userAnswer.toString().toLowerCase() === q.correctAnswer.toString().toLowerCase();
                markQuestionAttempted(q.id, isCorrect, 0); // TODO: Track actual time
            }
        });
        setProgress(getProgress());
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Quiz Navigation
    const goToQuestion = (index) => {
        setCurrentQ(index);
        setVisitedQuestions(prev => new Set([...prev, index]));
    };

    const handleNumPadClick = (num) => {
        const current = titaInputs[currentQ] || '';
        if (current.length < 10) {
            const newValue = current + num;
            setTitaInputs({ ...titaInputs, [currentQ]: newValue });
            setAnswers({ ...answers, [currentQ]: newValue });
        }
    };

    const handleBackspace = () => {
        const current = titaInputs[currentQ] || '';
        if (current.length > 0) {
            const newValue = current.slice(0, -1);
            setTitaInputs({ ...titaInputs, [currentQ]: newValue });
            if (newValue) {
                setAnswers({ ...answers, [currentQ]: newValue });
            } else {
                const newAnswers = { ...answers };
                delete newAnswers[currentQ];
                setAnswers(newAnswers);
            }
        }
    };

    const clearResponse = () => {
        const newAnswers = { ...answers };
        delete newAnswers[currentQ];
        setAnswers(newAnswers);
        setTitaInputs({ ...titaInputs, [currentQ]: '' });
    };

    // Render Helpers
    const renderBrowse = () => {
        const filtered = getFilteredQuestions();

        return (
            <div className="browse-container">
                <div className="progress-header">
                    <div className="progress-info">
                        <h3>Overall Mastery</h3>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${stats.accuracy}%` }}></div>
                        </div>
                        <div className="progress-stats-row">
                            <span>{stats.totalAttempted} / 150 Solved</span>
                            <span>{Math.round(stats.accuracy)}% Accuracy</span>
                        </div>
                    </div>
                </div>

                <div className="filter-bar">
                    <div className="filter-group">
                        <span className="filter-label">Topic</span>
                        <select
                            className="filter-select"
                            value={filters.topic}
                            onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                        >
                            <option value="All">All Topics</option>
                            {TOPICS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <span className="filter-label">Difficulty</span>
                        <select
                            className="filter-select"
                            value={filters.difficulty}
                            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                        >
                            <option value="All">All Levels</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.showBookmarked}
                                onChange={(e) => setFilters({ ...filters, showBookmarked: e.target.checked })}
                            />
                            <span>Bookmarked Only</span>
                        </label>
                    </div>
                    <button className="reset-filters" onClick={() => setFilters({ topic: 'All', difficulty: 'All', showCompleted: true, showBookmarked: false })}>
                        Reset
                    </button>
                </div>

                <div className="topics-list">
                    {TOPICS.filter(t => filters.topic === 'All' || t.name === filters.topic).map(topic => {
                        const topicQs = coreStructures.questions.filter(q => q.topic === topic.name);
                        const topicAttempted = topicQs.filter(q => progress.attempted[q.id]).length;
                        const topicPercent = Math.round((topicAttempted / topicQs.length) * 100);

                        return (
                            <div key={topic.id} className="topic-section">
                                <div className="topic-header" onClick={() => startPractice(topicQs)}>
                                    <div className="topic-title-group">
                                        <span className="topic-icon">{topic.icon}</span>
                                        <span className="topic-name">{topic.name}</span>
                                    </div>
                                    <div className="topic-meta">
                                        <span className="topic-progress-text">{topicAttempted} / {topicQs.length} Solved</span>
                                        <span className="subtopic-percent">{topicPercent}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="btn-start-random" onClick={() => startPractice(filtered.slice(0, 10))}>
                    <span>🚀 Start Mixed Practice (10 Qs)</span>
                </button>
            </div>
        );
    };

    const renderPreview = () => (
        <div className="preview-container">
            <h2>Practice Set Preview</h2>
            <p>{selectedQuestions.length} questions selected based on your filters.</p>

            <div className="preview-list">
                {selectedQuestions.map((q, i) => (
                    <div key={q.id} className="preview-item">
                        <span className="preview-q-text">{i + 1}. {q.question.slice(0, 100)}...</span>
                        <span className={`tag ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    </div>
                ))}
            </div>

            <div className="preview-actions">
                <button className="btn btn-secondary" onClick={() => setStage('browse')}>Back</button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`btn ${!isTimed ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setIsTimed(!isTimed)}>
                        {isTimed ? '⏲️ Timed' : '♾️ Untimed'}
                    </button>
                    <button className="btn btn-primary" onClick={enterQuiz}>Start Practice</button>
                </div>
            </div>
        </div>
    );

    const renderQuiz = () => {
        const q = selectedQuestions[currentQ];
        if (!q) return null;

        const isTITA = q.type === 'TITA';
        const getStatus = (i) => {
            const hasAns = answers[i] !== undefined;
            const isMarked = markedForReview.has(i);
            if (hasAns && isMarked) return 'answered-marked';
            if (hasAns) return 'answered';
            if (isMarked) return 'marked';
            if (visitedQuestions.has(i)) return 'not-answered';
            return 'not-visited';
        };

        return (
            <div className="cat-quiz-container">
                <div className="cat-header">
                    <div className="cat-section-tabs">
                        <button className="section-tab">Quant Ninja Bank</button>
                    </div>
                    {isTimed && (
                        <div className="cat-timer">
                            <span className="timer-label">Time Left:</span>
                            <span className={`timer-value ${timeLeft < 60 ? 'warning' : ''}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="cat-question-info">
                    <span className="question-type">Question Type: {isTITA ? 'TITA' : 'MCQ'}</span>
                    <span className="question-marks">Marks: +3 | -1</span>
                </div>

                <div className="cat-body">
                    <div className="cat-question-panel">
                        <div className="question-header-row">
                            <div className="question-number">Question No. {currentQ + 1}</div>
                            <div className="question-actions">
                                <button
                                    className={`bookmark-btn ${isBookmarked(q.id) ? 'active' : ''}`}
                                    onClick={() => {
                                        toggleBookmark(q.id);
                                        setProgress(getProgress());
                                    }}
                                    title="Bookmark for later"
                                >
                                    {isBookmarked(q.id) ? '★ Bookmarked' : '☆ Bookmark'}
                                </button>
                                <div className="question-counter">
                                    {currentQ + 1} of {selectedQuestions.length}
                                </div>
                            </div>
                        </div>
                        <div className="question-text">{q.question}</div>

                        {isTITA ? (
                            <div className="tita-section">
                                <div className="tita-input-display">
                                    {titaInputs[currentQ] || ''}
                                    <span className="tita-cursor">|</span>
                                </div>
                                <div className="number-pad">
                                    <button className="numpad-btn backspace" onClick={handleBackspace}>Backspace</button>
                                    <div className="numpad-grid">
                                        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '-'].map((num) => (
                                            <button key={num} className="numpad-btn" onClick={() => handleNumPadClick(num)}>{num}</button>
                                        ))}
                                    </div>
                                    <button className="numpad-btn clear-all" onClick={clearResponse}>Clear All</button>
                                </div>
                            </div>
                        ) : (
                            <div className="options-list">
                                {q.options && q.options.map((opt, i) => {
                                    const isSelected = answers[currentQ] === i;
                                    return (
                                        <button
                                            key={i}
                                            className={`quiz-option ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setAnswers({ ...answers, [currentQ]: i })}
                                        >
                                            <span className="option-radio">{isSelected ? '●' : '○'}</span>
                                            <span className="option-text">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="cat-controls">
                            <div className="controls-left">
                                <button
                                    className="cat-btn prev"
                                    onClick={() => goToQuestion(currentQ - 1)}
                                    disabled={currentQ === 0}
                                >
                                    ◀ Previous
                                </button>
                            </div>
                            <div className="controls-center">
                                <button className="cat-btn mark-review" onClick={() => {
                                    setMarkedForReview(prev => new Set([...prev, currentQ]));
                                    if (currentQ < selectedQuestions.length - 1) goToQuestion(currentQ + 1);
                                }}>Mark for Review & Next</button>
                                <button className="cat-btn clear" onClick={clearResponse}>Clear Response</button>
                            </div>
                            <div className="controls-right">
                                <button className="cat-btn save-next" onClick={() => {
                                    if (currentQ < selectedQuestions.length - 1) goToQuestion(currentQ + 1);
                                    else setShowSubmitConfirm(true);
                                }}>{currentQ === selectedQuestions.length - 1 ? 'Save & Submit' : 'Save & Next ▶'}</button>
                            </div>
                        </div>
                    </div>

                    <div className="cat-sidebar">
                        <div className="cat-section-header"><span>Question Palette</span></div>
                        <div className="cat-question-grid">
                            {selectedQuestions.map((_, i) => (
                                <button key={i} className={`grid-btn ${getStatus(i)} ${i === currentQ ? 'current' : ''}`} onClick={() => goToQuestion(i)}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <div className="cat-legend">
                            <div className="legend-item"><span className="legend-box answered"></span> Answered</div>
                            <div className="legend-item"><span className="legend-box not-answered"></span> Not Answered</div>
                            <div className="legend-item"><span className="legend-box not-visited"></span> Not Visited</div>
                            <div className="legend-item"><span className="legend-box marked"></span> Marked for Review</div>
                            <div className="legend-item"><span className="legend-box answered-marked"></span> Answered & Marked</div>
                        </div>

                        <button className="cat-submit-btn" onClick={() => setShowSubmitConfirm(true)}>Submit</button>
                    </div>
                </div>

                {showSubmitConfirm && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Submit Test?</h3>
                            <p>You have answered {Object.keys(answers).length} of {selectedQuestions.length} questions.</p>
                            <div className="modal-actions">
                                <button className="btn btn-secondary" onClick={() => setShowSubmitConfirm(false)}>Go Back</button>
                                <button className="btn btn-primary" onClick={handleQuizSubmit}>Confirm Submit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderResult = () => {
        let correct = 0;
        selectedQuestions.forEach((q, i) => {
            const userAns = answers[i];
            if (userAns !== undefined && userAns.toString().toLowerCase() === q.correctAnswer.toString().toLowerCase()) correct++;
        });

        return (
            <div className="result-container">
                <div className="result-header">
                    <h1>Set Analysis</h1>
                    <div className="score-summary-grid">
                        <div className="score-card main-score">
                            <div className="score-circle">
                                <span className="score-number">{correct}</span>
                                <span className="score-total">/ {selectedQuestions.length}</span>
                            </div>
                            <div className="score-label">Score</div>
                        </div>
                        <div className="quick-stats">
                            <div className="stat-box">
                                <span className="stat-val">{Math.round((correct / selectedQuestions.length) * 100)}%</span>
                                <span className="stat-name">Accuracy</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="solutions-section">
                    <h3>Review Questions</h3>
                    {selectedQuestions.map((q, i) => {
                        const userAns = answers[i];
                        const isCorrect = userAns !== undefined && userAns.toString().toLowerCase() === q.correctAnswer.toString().toLowerCase();
                        const isHintExpanded = showNinjaHint[i];

                        return (
                            <div key={q.id} className={`solution-card ${isCorrect ? 'correct' : userAns !== undefined ? 'incorrect' : 'unattempted'}`}>
                                <div className="solution-header">
                                    <div className="solution-status">{isCorrect ? '✓' : userAns !== undefined ? '✗' : '○'}</div>
                                    <div className="solution-info">
                                        <div className="solution-q-text">{q.question}</div>
                                    </div>
                                </div>
                                <div className="solution-body">
                                    <div className="answer-summary">
                                        <div className="answer-item">
                                            <span>Correct Answer:</span>
                                            <strong>{q.type === 'MCQ' ? q.options[q.correctAnswer] : q.correctAnswer}</strong>
                                        </div>
                                    </div>
                                    <div className="solution-explanation">
                                        <div className="explanation-header">Ninja Insight & Approach</div>
                                        <button className="btn-hint-toggle" onClick={() => setShowNinjaHint({ ...showNinjaHint, [i]: !isHintExpanded })}>
                                            {isHintExpanded ? 'Hide Ninja Secret' : 'Reveal Ninja Secret 🥷'}
                                        </button>
                                        {isHintExpanded && (
                                            <div className="hint-content">
                                                <p><strong>Trigger:</strong> {q.recognitionTrigger}</p>
                                                <p><strong>Shortcut:</strong> {q.mentalShortcut}</p>
                                                <hr />
                                                <p><strong>Approach:</strong> {q.solution.approach}</p>
                                                <ul>
                                                    {q.solution.steps.map((s, si) => <li key={si}>{s}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="result-actions">
                    <button className="btn btn-primary" onClick={() => setStage('browse')}>Continue Training</button>
                    <Link to="/" className="btn btn-secondary">Exit to Dojo</Link>
                </div>
            </div>
        );
    };

    return (
        <main className={`course-page ${stage === 'quiz' ? 'quiz-mode' : ''}`}>
            {stage !== 'quiz' && <div className="ink-wash"></div>}
            <div className="container">
                {stage !== 'quiz' && (
                    <div className="page-header">
                        <Link to="/" className="back-link">← Back</Link>
                        <h1>Question Bank</h1>
                        <p>150 Most Expected CAT 2026 Structures</p>
                    </div>
                )}

                {hasAccess ? (
                    <div className="unlocked-content">
                        {stage === 'browse' && renderBrowse()}
                        {stage === 'preview' && renderPreview()}
                        {stage === 'quiz' && renderQuiz()}
                        {stage === 'result' && renderResult()}
                    </div>
                ) : (
                    <div className="locked-content">
                        <div className="lock-icon">🔒</div>
                        <h2>Premium Question Bank</h2>
                        <p className="lock-desc">
                            150 handpicked CAT 2026 patterns across Arithmetic, Algebra, Geometry, and more.
                        </p>
                        <div className="pricing-card">
                            <div className="included-list">
                                <div className="included-item"><span className="check-icon">✓</span> 150 CURATED QUESTIONS</div>
                                <div className="included-item"><span className="check-icon">✓</span> NINJA RECOGNITION TRIGGERS</div>
                                <div className="included-item"><span className="check-icon">✓</span> 99%ILE SHORTCUTS</div>
                            </div>
                            <br />
                            <button className="btn btn-primary btn-full" onClick={() => setShowModal(true)}>Unlock Now</button>
                        </div>
                        <div className="preview-note">💡 Try dev email <code>xyz111@email.com</code> for a test drive</div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        {!submitted ? (
                            <form onSubmit={handleAccessSubmit}>
                                <h3>Enterprise Access</h3>
                                <p>Enter your authorized email to unlock the Dojo.</p>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="samurai@quantninja.com"
                                    required
                                />
                                <button type="submit" className="btn btn-primary btn-full">Unlock Dojo</button>
                            </form>
                        ) : (
                            <div className="success"><h3>Waitlisted!</h3><p>Check your email for access soon.</p></div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
