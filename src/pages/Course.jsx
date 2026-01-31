import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coreStructures from '../data/coreStructures';
import {
    getProgress,
    markQuestionAttempted,
    toggleBookmark,
    isBookmarked,
    getStats
} from '../services/progressService';
import { isAuthenticated } from '../services/authService';
import { saveEmailToWaitlist } from '../services/emailService.js';
import AuthModal from '../components/AuthModal';
import './Course.css';
import './NotesQuiz.css';

const DEV_EMAILS = ['xyz111@email.com', 'admin@quantninja.com'];

const TOPICS = [
    { id: 'arithmetic', name: 'Arithmetic', icon: '', count: 65 },
    { id: 'algebra', name: 'Algebra', icon: '', count: 42 },
    { id: 'geometry', name: 'Geometry', icon: '', count: 22 },
    { id: 'numberSystem', name: 'Number System', icon: '', count: 11 },
    { id: 'modernMath', name: 'Modern Math', icon: '', count: 10 }
];

export default function Course() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);

    // Auth Modal State
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // Stage Management & Navigation History
    const [stage, setStage] = useState('browse'); // browse, preview, quiz, result
    const [selectedTopic, setSelectedTopic] = useState(null); // Track which topic was selected

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
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showNinjaHint, setShowNinjaHint] = useState({});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Calculator State
    const [showCalculator, setShowCalculator] = useState(false);
    const [calcDisplay, setCalcDisplay] = useState('0');
    const [calcMemory, setCalcMemory] = useState(0);
    const [calcPrevValue, setCalcPrevValue] = useState(null);
    const [calcOperator, setCalcOperator] = useState(null);
    const [calcNewNumber, setCalcNewNumber] = useState(true);

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

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (stage !== 'quiz') return;
            if (showSubmitConfirm || showExitConfirm) return; // Don't navigate if modal open

            if (e.key === 'ArrowLeft' && currentQ > 0) {
                e.preventDefault();
                goToQuestion(currentQ - 1);
            } else if (e.key === 'ArrowRight' && currentQ < selectedQuestions.length - 1) {
                e.preventDefault();
                goToQuestion(currentQ + 1);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowExitConfirm(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stage, currentQ, selectedQuestions.length, showSubmitConfirm, showExitConfirm]);

    const handleAccessSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (DEV_EMAILS.includes(email.toLowerCase())) {
            setHasAccess(true);
            setShowModal(false);
            return;
        }

        setIsLoading(true);

        const result = await saveEmailToWaitlist(email, {
            name: name.trim(),
            source: 'course_access_request',
            page: 'course',
        });

        setIsLoading(false);

        if (result.success) {
            setSubmitted(true);
            setTimeout(() => {
                setShowModal(false);
                setSubmitted(false);
                setName('');
                setEmail('');
            }, 2000);
        } else {
            setSubmitError(result.error || 'Failed to join waitlist. Please try again.');
        }
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
    const startPractice = (qs, topicName = null) => {
        // Check if user is authenticated before starting practice
        if (!isAuthenticated()) {
            setPendingAction(() => () => startPracticeInternal(qs, topicName));
            setShowAuthModal(true);
            return;
        }
        startPracticeInternal(qs, topicName);
    };

    const startPracticeInternal = (qs, topicName) => {
        setSelectedQuestions(qs);
        setSelectedTopic(topicName);
        setCurrentQ(0);
        setAnswers({});
        setTitaInputs({});
        setMarkedForReview(new Set());
        setVisitedQuestions(new Set([0]));
        setTimeLeft(qs.length * 120); // 2 mins per question
        setIsTimed(true); // Default to timed
        setStage('preview'); // Show ready screen
    };

    // Handle auth success - resume pending action
    const handleAuthSuccess = () => {
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };

    // Hierarchical back navigation
    const handleBack = () => {
        switch (stage) {
            case 'preview':
                setStage('browse');
                setSelectedTopic(null);
                break;
            case 'result':
                setStage('browse');
                setSelectedTopic(null);
                break;
            default:
                navigate('/');
        }
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

    // Toggle mark for review (can mark AND unmark)
    const toggleMarkForReview = (index = currentQ) => {
        setMarkedForReview(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    // Exit quiz with confirmation
    const handleExitQuiz = () => {
        setShowExitConfirm(false);
        setStage('browse');
    };

    // Get quiz statistics for modals
    const getQuizStats = () => {
        const answered = Object.keys(answers).length;
        const marked = markedForReview.size;
        const unanswered = selectedQuestions.length - answered;
        return { answered, marked, unanswered, total: selectedQuestions.length };
    };

    // Calculator Functions
    const calcInput = (digit) => {
        if (calcNewNumber) {
            setCalcDisplay(digit === '.' ? '0.' : digit);
            setCalcNewNumber(false);
        } else {
            if (digit === '.' && calcDisplay.includes('.')) return;
            if (calcDisplay === '0' && digit !== '.') {
                setCalcDisplay(digit);
            } else {
                setCalcDisplay(calcDisplay + digit);
            }
        }
    };

    const calcOperation = (op) => {
        const current = parseFloat(calcDisplay);
        if (calcOperator && !calcNewNumber) {
            const result = calculate(calcPrevValue, current, calcOperator);
            setCalcDisplay(String(result));
            setCalcPrevValue(result);
        } else {
            setCalcPrevValue(current);
        }
        setCalcOperator(op);
        setCalcNewNumber(true);
    };

    const calculate = (a, b, op) => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 'Error';
            default: return b;
        }
    };

    const calcEquals = () => {
        if (!calcOperator) return;
        const current = parseFloat(calcDisplay);
        const result = calculate(calcPrevValue, current, calcOperator);
        setCalcDisplay(String(result));
        setCalcPrevValue(null);
        setCalcOperator(null);
        setCalcNewNumber(true);
    };

    const calcClear = () => {
        setCalcDisplay('0');
        setCalcPrevValue(null);
        setCalcOperator(null);
        setCalcNewNumber(true);
    };

    const calcBackspace = () => {
        if (calcDisplay.length > 1) {
            setCalcDisplay(calcDisplay.slice(0, -1));
        } else {
            setCalcDisplay('0');
            setCalcNewNumber(true);
        }
    };

    const calcToggleSign = () => {
        setCalcDisplay(String(parseFloat(calcDisplay) * -1));
    };

    const calcPercent = () => {
        setCalcDisplay(String(parseFloat(calcDisplay) / 100));
    };

    const calcInverse = () => {
        const val = parseFloat(calcDisplay);
        if (val !== 0) setCalcDisplay(String(1 / val));
    };

    const calcSqrt = () => {
        const val = parseFloat(calcDisplay);
        if (val >= 0) setCalcDisplay(String(Math.sqrt(val)));
    };

    const calcMemoryClear = () => setCalcMemory(0);
    const calcMemoryRecall = () => { setCalcDisplay(String(calcMemory)); setCalcNewNumber(true); };
    const calcMemoryStore = () => setCalcMemory(parseFloat(calcDisplay));
    const calcMemoryAdd = () => setCalcMemory(calcMemory + parseFloat(calcDisplay));
    const calcMemorySubtract = () => setCalcMemory(calcMemory - parseFloat(calcDisplay));

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
                                <div className="topic-header" onClick={() => startPractice(topicQs, topic.name)}>
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

                <button className="btn-start-random" onClick={() => startPractice(filtered.slice(0, 10), 'Mixed Practice')}>
                    <span>Start Mixed Practice</span>
                </button>
            </div>
        );
    };

    const renderPreview = () => {
        const totalMinutes = Math.ceil((selectedQuestions.length * 120) / 60);
        const topicCounts = {};
        selectedQuestions.forEach(q => {
            topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
        });
        const mainTopic = Object.keys(topicCounts).sort((a, b) => topicCounts[b] - topicCounts[a])[0] || 'Mixed';

        return (
            <div className="ready-screen">
                <div className="ready-card">
                    <div className="ready-brand-mark"></div>
                    <h2 className="ready-title">Prepare for Session</h2>

                    <div className="ready-stats">
                        <div className="ready-stat">
                            <span className="stat-value">{selectedQuestions.length}</span>
                            <span className="stat-label">Questions</span>
                        </div>
                        <div className="ready-divider"></div>
                        <div className="ready-stat">
                            <span className="stat-value">{totalMinutes}</span>
                            <span className="stat-label">Minutes</span>
                        </div>
                        <div className="ready-divider"></div>
                        <div className="ready-stat">
                            <span className="stat-value">{mainTopic}</span>
                            <span className="stat-label">Topic</span>
                        </div>
                    </div>

                    <div className="timer-toggle">
                        <button
                            className={`toggle-btn ${isTimed ? 'active' : ''}`}
                            onClick={() => setIsTimed(true)}
                        >
                            ⏱️ Timed
                        </button>
                        <button
                            className={`toggle-btn ${!isTimed ? 'active' : ''}`}
                            onClick={() => setIsTimed(false)}
                        >
                            ♾️ Untimed
                        </button>
                    </div>

                    <button className="start-btn-big" onClick={enterQuiz}>
                        Start Practice
                        <span className="start-arrow">→</span>
                    </button>

                    <button className="back-link-subtle" onClick={() => setStage('browse')}>
                        ← Change Selection
                    </button>
                </div>
            </div>
        );
    };

    const renderQuiz = () => {
        const q = selectedQuestions[currentQ];
        if (!q) return null;

        const isTITA = q.type === 'TITA';
        const stats = getQuizStats();
        const isCurrentMarked = markedForReview.has(currentQ);

        const getStatus = (i) => {
            const hasAns = answers[i] !== undefined;
            const isMarked = markedForReview.has(i);
            if (hasAns && isMarked) return 'answered-marked';
            if (hasAns) return 'answered';
            if (isMarked) return 'marked';
            if (visitedQuestions.has(i)) return 'not-answered';
            return 'not-visited';
        };

        const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

        return (
            <div className="cat-quiz-wrapper">
                {/* Top Header */}
                <header className="cat-top-header">
                    <div className="header-section left">
                        <span className="section-label">Section</span>
                    </div>
                    <div className="header-section center">
                        {isTimed && (
                            <div className={`cat-timer-box ${timeLeft < 60 ? 'critical' : timeLeft < 300 ? 'warning' : ''}`}>
                                <span className="timer-text">Time Left: </span>
                                <span className="timer-digits">{formatTime(timeLeft)}</span>
                            </div>
                        )}
                    </div>
                    <div className="header-section right">
                        <button className="cat-tool-btn" onClick={() => setShowCalculator(!showCalculator)} title="Calculator">
                            🧮
                        </button>
                        <button className="cat-exit-btn" onClick={() => setShowExitConfirm(true)}>
                            ✕ Exit
                        </button>
                    </div>
                </header>

                {/* Question Type Bar */}
                <div className="cat-type-bar">
                    <span className="type-info">Type: {isTITA ? 'TITA' : 'MCQ'} | Marks: <span className="positive">+3</span> <span className="negative">-1</span></span>
                </div>

                {/* Main Layout */}
                <div className="cat-main-layout">
                    {/* Question Area - Scrollable */}
                    <main className="cat-question-area">
                        <div className="question-scroll-container">
                            {/* Question Header */}
                            <div className="cat-q-header">
                                <h2 className="q-number">Question No. {currentQ + 1}</h2>
                                <div className="q-actions">
                                    <button
                                        className={`action-btn bookmark ${isBookmarked(q.id) ? 'active' : ''}`}
                                        onClick={() => { toggleBookmark(q.id); setProgress(getProgress()); }}
                                    >
                                        {isBookmarked(q.id) ? '★ Saved' : '☆ Save'}
                                    </button>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="cat-question-text">
                                <p>{q.question}</p>
                            </div>

                            {/* Answer Section */}
                            {isTITA ? (
                                <div className="cat-tita-section">
                                    <div className="tita-input-box">
                                        <input
                                            type="text"
                                            value={titaInputs[currentQ] || ''}
                                            readOnly
                                            placeholder="Enter your answer"
                                        />
                                    </div>
                                    <div className="cat-numpad">
                                        <button className="np-btn fn" onClick={handleBackspace}>Backspace</button>
                                        <div className="np-grid">
                                            {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '-'].map(n => (
                                                <button key={n} className="np-btn" onClick={() => handleNumPadClick(n)}>{n}</button>
                                            ))}
                                        </div>
                                        <button className="np-btn fn clear" onClick={clearResponse}>Clear All</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="cat-options">
                                    {q.options && q.options.map((opt, i) => (
                                        <label key={i} className={`cat-option ${answers[currentQ] === i ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`q-${currentQ}`}
                                                checked={answers[currentQ] === i}
                                                onChange={() => setAnswers({ ...answers, [currentQ]: i })}
                                            />
                                            <span className="option-letter">{optionLabels[i]}</span>
                                            <span className="option-content">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom Controls */}
                        <div className="cat-bottom-controls">
                            <div className="controls-left">
                                <button
                                    className={`cat-ctrl-btn mark ${isCurrentMarked ? 'active' : ''}`}
                                    onClick={() => {
                                        toggleMarkForReview();
                                        if (currentQ < selectedQuestions.length - 1) goToQuestion(currentQ + 1);
                                    }}
                                >
                                    Mark for Review & Next
                                </button>
                                <button className="cat-ctrl-btn clear" onClick={clearResponse}>
                                    Clear Response
                                </button>
                            </div>
                            <div className="controls-right">
                                <button
                                    className="cat-ctrl-btn prev"
                                    onClick={() => goToQuestion(currentQ - 1)}
                                    disabled={currentQ === 0}
                                >
                                    ◀ Previous
                                </button>
                                <button
                                    className="cat-ctrl-btn next primary"
                                    onClick={() => {
                                        if (currentQ < selectedQuestions.length - 1) {
                                            goToQuestion(currentQ + 1);
                                        } else {
                                            setShowSubmitConfirm(true);
                                        }
                                    }}
                                >
                                    Save & Next ▶
                                </button>
                            </div>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="cat-sidebar-panel">
                        <div className="sidebar-scroll">
                            <div className="panel-header">
                                <span>Question Palette</span>
                            </div>

                            <div className="palette-stats">
                                <span className="ps-item answered">{stats.answered} Answered</span>
                                <span className="ps-item not-answered">{stats.unanswered} Not Answered</span>
                                <span className="ps-item marked">{stats.marked} Marked</span>
                            </div>

                            <div className="question-palette">
                                {selectedQuestions.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`palette-btn ${getStatus(i)} ${i === currentQ ? 'current' : ''}`}
                                        onClick={() => goToQuestion(i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="palette-legend">
                                <div className="legend-item"><span className="lg-box answered"></span> Answered</div>
                                <div className="legend-item"><span className="lg-box not-answered"></span> Not Answered</div>
                                <div className="legend-item"><span className="lg-box not-visited"></span> Not Visited</div>
                                <div className="legend-item"><span className="lg-box marked"></span> Marked for Review</div>
                                <div className="legend-item"><span className="lg-box answered-marked"></span> Answered & Marked</div>
                            </div>
                        </div>

                        <button className="cat-submit-test" onClick={() => setShowSubmitConfirm(true)}>
                            Submit Test
                        </button>
                    </aside>
                </div>

                {/* Calculator Modal */}
                {showCalculator && (
                    <div className="calc-modal">
                        <div className="calc-container">
                            <div className="calc-header">
                                <span>Calculator</span>
                                <button className="calc-close" onClick={() => setShowCalculator(false)}>✕</button>
                            </div>
                            <div className="calc-display">
                                <div className="calc-expression"></div>
                                <div className="calc-result">{calcDisplay}</div>
                            </div>
                            <div className="calc-buttons">
                                <div className="calc-row memory">
                                    <button onClick={calcMemoryClear}>MC</button>
                                    <button onClick={calcMemoryRecall}>MR</button>
                                    <button onClick={calcMemoryStore}>MS</button>
                                    <button onClick={calcMemoryAdd}>M+</button>
                                    <button onClick={calcMemorySubtract}>M-</button>
                                </div>
                                <div className="calc-row">
                                    <button className="fn-btn red" onClick={calcBackspace}>←</button>
                                    <button className="fn-btn red" onClick={calcClear}>C</button>
                                    <button className="fn-btn red" onClick={calcToggleSign}>+/-</button>
                                    <button className="fn-btn" onClick={calcSqrt}>√</button>
                                </div>
                                <div className="calc-row">
                                    <button onClick={() => calcInput('7')}>7</button>
                                    <button onClick={() => calcInput('8')}>8</button>
                                    <button onClick={() => calcInput('9')}>9</button>
                                    <button className="fn-btn" onClick={() => calcOperation('/')}>/</button>
                                    <button className="fn-btn" onClick={calcPercent}>%</button>
                                </div>
                                <div className="calc-row">
                                    <button onClick={() => calcInput('4')}>4</button>
                                    <button onClick={() => calcInput('5')}>5</button>
                                    <button onClick={() => calcInput('6')}>6</button>
                                    <button className="fn-btn" onClick={() => calcOperation('*')}>*</button>
                                    <button className="fn-btn" onClick={calcInverse}>1/x</button>
                                </div>
                                <div className="calc-row">
                                    <button onClick={() => calcInput('1')}>1</button>
                                    <button onClick={() => calcInput('2')}>2</button>
                                    <button onClick={() => calcInput('3')}>3</button>
                                    <button className="fn-btn" onClick={() => calcOperation('-')}>-</button>
                                    <button className="fn-btn green equals" onClick={calcEquals}>=</button>
                                </div>
                                <div className="calc-row">
                                    <button onClick={() => calcInput('0')}>0</button>
                                    <button onClick={() => calcInput('.')}>.</button>
                                    <button className="fn-btn" onClick={() => calcOperation('+')}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Modal */}
                {showSubmitConfirm && (
                    <div className="cat-modal-overlay">
                        <div className="cat-modal">
                            <h3>Submit Test?</h3>
                            <div className="modal-summary">
                                <p><strong>Answered:</strong> <span className="good">{stats.answered}</span></p>
                                <p><strong>Not Answered:</strong> <span className="warn">{stats.unanswered}</span></p>
                                <p><strong>Marked for Review:</strong> {stats.marked}</p>
                            </div>
                            {stats.unanswered > 0 && (
                                <p className="warning-text">⚠️ You have {stats.unanswered} unanswered questions!</p>
                            )}
                            <div className="modal-btns">
                                <button className="modal-btn cancel" onClick={() => setShowSubmitConfirm(false)}>Go Back</button>
                                <button className="modal-btn submit" onClick={handleQuizSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Exit Modal */}
                {showExitConfirm && (
                    <div className="cat-modal-overlay">
                        <div className="cat-modal">
                            <h3>Exit Test?</h3>
                            <p>Your progress will be lost. Are you sure?</p>
                            <div className="modal-btns">
                                <button className="modal-btn cancel" onClick={() => setShowExitConfirm(false)}>Continue</button>
                                <button className="modal-btn exit" onClick={handleExitQuiz}>Exit</button>
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
                                        <div className="explanation-header">Concept & Approach</div>
                                        <button className="btn-hint-toggle" onClick={() => setShowNinjaHint({ ...showNinjaHint, [i]: !isHintExpanded })}>
                                            {isHintExpanded ? 'Hide Details' : 'View Approach'}
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
                        <button className="back-link" onClick={handleBack}>← Back</button>
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

                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => !isLoading && setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        {!submitted ? (
                            <form onSubmit={handleAccessSubmit}>
                                <h3>Enterprise Access</h3>
                                <p>Enter your details to unlock the Dojo.</p>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                    disabled={isLoading}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="samurai@quantninja.com"
                                    required
                                    disabled={isLoading}
                                />
                                {submitError && (
                                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        {submitError}
                                    </p>
                                )}
                                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : 'Unlock Dojo'}
                                </button>
                            </form>
                        ) : (
                            <div className="success"><h3>Waitlisted!</h3><p>Check your email for access soon.</p></div>
                        )}
                    </div>
                </div>
            )}

            {/* Auth Modal for sign-in before practice */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => {
                    setShowAuthModal(false);
                    setPendingAction(null);
                }}
                onSuccess={handleAuthSuccess}
            />
        </main>
    );
}
