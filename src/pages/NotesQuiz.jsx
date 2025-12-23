import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { hasApiKey, generateQuiz } from '../services/geminiService';
import './NotesQuiz.css';

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'difficult', 'mixture'];
const QUESTION_COUNT_OPTIONS = [5, 10, 20];

// Timer durations based on question count (in seconds)
const getTimerDuration = (count) => {
    const durations = { 5: 600, 10: 1200, 20: 2400 }; // 10min, 20min, 40min
    return durations[count] || 600;
};

export default function NotesQuiz() {
    // Stage management
    const [stage, setStage] = useState('config'); // config, loading, quiz, result

    // Config state
    const [files, setFiles] = useState([]);
    const [notesText, setNotesText] = useState(''); // Manual text input
    const [difficulty, setDifficulty] = useState('medium');
    const [questionCount, setQuestionCount] = useState(5);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Quiz state
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [titaInputs, setTitaInputs] = useState({}); // For TITA numeric inputs
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
    const [timeLeft, setTimeLeft] = useState(0);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Result state
    const [showSolutions, setShowSolutions] = useState({});

    // Timer effect
    useEffect(() => {
        if (stage !== 'quiz' || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [stage, timeLeft]);

    // Hide navbar and footer during quiz
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
            // Cleanup - restore on unmount
            if (navbar) navbar.style.display = '';
            if (footer) footer.style.display = '';
            document.body.style.paddingTop = '';
        };
    }, [stage]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles([...files, ...newFiles]);
        setError('');
    };

    // Handle file drop
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(f =>
            f.type.startsWith('image/') || f.type === 'application/pdf'
        );
        setFiles([...files, ...validFiles]);
    }, [files]);

    const handleDragOver = (e) => e.preventDefault();

    // Remove file
    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // Generate quiz
    const handleGenerateQuiz = async () => {
        if (files.length === 0 && !notesText.trim()) {
            setError('Please upload notes or type your notes content below');
            return;
        }

        setStage('loading');
        setError('');
        setLoadingMessage('Analyzing your notes...');

        try {
            setTimeout(() => setLoadingMessage('Reading your notes carefully...'), 2000);
            setTimeout(() => setLoadingMessage('Extracting formulas and concepts...'), 4000);
            setTimeout(() => setLoadingMessage('Generating CAT 2023-25 style questions...'), 7000);
            setTimeout(() => setLoadingMessage('Preparing your personalized quiz...'), 10000);

            // Pass both files and manual text
            const generatedQuestions = await generateQuiz(files, {
                difficulty,
                questionCount
            }, notesText.trim() || null);

            setQuestions(generatedQuestions);
            setTimeLeft(getTimerDuration(questionCount));
            setAnswers({});
            setTitaInputs({});
            setMarkedForReview(new Set());
            setVisitedQuestions(new Set([0]));
            setCurrentQ(0);
            setStage('quiz');
        } catch (err) {
            setError(err.message);
            setStage('config');
        }
    };

    // Quiz navigation
    const goToQuestion = (index) => {
        setCurrentQ(index);
        setVisitedQuestions(prev => new Set([...prev, index]));
    };

    const handlePrevious = () => {
        if (currentQ > 0) goToQuestion(currentQ - 1);
    };

    const handleNext = () => {
        if (currentQ < questions.length - 1) goToQuestion(currentQ + 1);
    };

    // MCQ Answer selection
    const selectAnswer = (option) => {
        setAnswers({ ...answers, [currentQ]: option });
    };

    // TITA number pad handlers
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

    const handleClearAll = () => {
        setTitaInputs({ ...titaInputs, [currentQ]: '' });
        const newAnswers = { ...answers };
        delete newAnswers[currentQ];
        setAnswers(newAnswers);
    };

    const clearResponse = () => {
        const newAnswers = { ...answers };
        delete newAnswers[currentQ];
        setAnswers(newAnswers);
        setTitaInputs({ ...titaInputs, [currentQ]: '' });
    };

    // Mark for review and next
    const handleMarkForReviewAndNext = () => {
        const newMarked = new Set(markedForReview);
        newMarked.add(currentQ);
        setMarkedForReview(newMarked);
        if (currentQ < questions.length - 1) {
            goToQuestion(currentQ + 1);
        }
    };

    // Submit quiz
    const handleSubmit = () => {
        setShowSubmitConfirm(false);
        setStage('result');
    };

    // Get question status for navigator
    const getQuestionStatus = (index) => {
        const isAnswered = answers[index] !== undefined;
        const isMarked = markedForReview.has(index);
        const isVisited = visitedQuestions.has(index);

        if (isAnswered && isMarked) return 'answered-marked';
        if (isAnswered) return 'answered';
        if (isMarked) return 'marked';
        if (isVisited) return 'not-answered';
        return 'not-visited';
    };

    // Calculate results
    const calculateResults = () => {
        let correct = 0;
        questions.forEach((q, i) => {
            const userAnswer = answers[i];
            const correctAnswer = q.answer;
            if (userAnswer && userAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase()) {
                correct++;
            }
        });
        return {
            correct,
            incorrect: Object.keys(answers).length - correct,
            unattempted: questions.length - Object.keys(answers).length,
            total: questions.length
        };
    };

    // Reset quiz
    const resetQuiz = () => {
        setStage('config');
        setFiles([]);
        setNotesText('');
        setQuestions([]);
        setAnswers({});
        setTitaInputs({});
        setMarkedForReview(new Set());
        setVisitedQuestions(new Set([0]));
        setShowSolutions({});
    };

    // Render config stage
    const renderConfig = () => (
        <div className="config-container">
            <div className="config-section">
                <div className="section-header">
                    <span className="section-icon">📄</span>
                    <h3>Upload Your Notes</h3>
                </div>
                <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,application/pdf"
                        multiple
                        hidden
                    />
                    <div className="upload-icon">📤</div>
                    <p className="upload-text">Drop files here or click to browse</p>
                    <p className="upload-hint">Supports PDF, PNG, JPG (including handwritten notes)</p>
                </div>

                {files.length > 0 && (
                    <div className="file-list">
                        {files.map((file, i) => (
                            <div key={i} className="file-item">
                                <span className="file-icon">
                                    {file.type === 'application/pdf' ? '📕' : '🖼️'}
                                </span>
                                <span className="file-name">{file.name}</span>
                                <button
                                    className="file-remove"
                                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* OR divider */}
                <div className="or-divider">
                    <span>OR</span>
                </div>

                {/* Manual text input */}
                <div className="text-input-section">
                    <label className="text-input-label">Type/Paste Your Notes:</label>
                    <textarea
                        className="notes-textarea"
                        placeholder="Type or paste your notes content here...&#10;&#10;Example:&#10;Sum of n numbers = n(n+1)/2&#10;Quadratic equation: ax² + bx + c = 0&#10;Sum of roots = -b/a&#10;Product of roots = c/a"
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        rows={6}
                    />
                </div>
            </div>

            <div className="config-section">
                <div className="section-header">
                    <span className="section-icon">📊</span>
                    <h3>Difficulty Level</h3>
                </div>
                <div className="option-buttons">
                    {DIFFICULTY_OPTIONS.map((level) => (
                        <button
                            key={level}
                            className={`option-btn ${difficulty === level ? 'active' : ''}`}
                            onClick={() => setDifficulty(level)}
                        >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="config-section">
                <div className="section-header">
                    <span className="section-icon">🔢</span>
                    <h3>Number of Questions</h3>
                </div>
                <div className="option-buttons">
                    {QUESTION_COUNT_OPTIONS.map((count) => (
                        <button
                            key={count}
                            className={`option-btn ${questionCount === count ? 'active' : ''}`}
                            onClick={() => setQuestionCount(count)}
                        >
                            {count} Questions
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
                className="btn btn-primary btn-generate"
                onClick={handleGenerateQuiz}
                disabled={files.length === 0 && !notesText.trim()}
            >
                Generate Quiz 🚀
            </button>
        </div>
    );

    // Render loading stage
    const renderLoading = () => (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>{loadingMessage}</h2>
            <p>This may take a few seconds...</p>
        </div>
    );

    // Render quiz stage - CAT Exam Style
    const renderQuiz = () => {
        const q = questions[currentQ];
        if (!q) return null;

        const answeredCount = Object.keys(answers).length;
        const notAnsweredCount = visitedQuestions.size - answeredCount;
        const notVisitedCount = questions.length - visitedQuestions.size;
        const markedCount = markedForReview.size;
        const answeredMarkedCount = [...markedForReview].filter(i => answers[i] !== undefined).length;
        const isTITA = q.type === 'TITA';

        return (
            <div className="cat-quiz-container">
                {/* Top Header Bar */}
                <div className="cat-header">
                    <div className="cat-section-tabs">
                        <button className="section-tab active">Quant</button>
                    </div>
                    <div className="cat-timer">
                        <span className="timer-label">Time Left:</span>
                        <span className={`timer-value ${timeLeft < 60 ? 'warning' : ''}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Question Type & Marks */}
                <div className="cat-question-info">
                    <span className="question-type">Type: {isTITA ? 'TITA' : 'MCQ'}</span>
                    <span className="question-marks">Marks: +3 -1</span>
                </div>

                <div className="cat-body">
                    {/* Question Panel */}
                    <div className="cat-question-panel">
                        <div className="question-number">Question No. {currentQ + 1}</div>
                        <div className="question-text">{q.question}</div>

                        {/* MCQ Options or TITA Input */}
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
                                            <button
                                                key={num}
                                                className="numpad-btn"
                                                onClick={() => handleNumPadClick(num)}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="numpad-btn clear-all" onClick={handleClearAll}>Clear All</button>
                                </div>
                            </div>
                        ) : (
                            <div className="options-list">
                                {q.options && q.options.map((opt, i) => {
                                    const optionLetter = opt.charAt(0);
                                    const isSelected = answers[currentQ] === optionLetter;
                                    return (
                                        <button
                                            key={i}
                                            className={`quiz-option ${isSelected ? 'selected' : ''}`}
                                            onClick={() => selectAnswer(optionLetter)}
                                        >
                                            <span className="option-radio">
                                                {isSelected ? '●' : '○'}
                                            </span>
                                            <span className="option-text">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Control Buttons - CAT Style */}
                        <div className="cat-controls">
                            <div className="controls-left">
                                <button
                                    className="cat-btn mark-review"
                                    onClick={handleMarkForReviewAndNext}
                                >
                                    Mark for Review & Next
                                </button>
                                <button
                                    className="cat-btn clear"
                                    onClick={clearResponse}
                                >
                                    Clear Response
                                </button>
                            </div>
                            <div className="controls-right">
                                <button
                                    className="cat-btn save-next"
                                    onClick={handleNext}
                                    disabled={currentQ === questions.length - 1}
                                >
                                    Save & Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Navigator */}
                    <div className="cat-sidebar">
                        {/* Stats Legend */}
                        <div className="cat-stats-legend">
                            <div className="legend-item">
                                <span className="legend-box answered">{answeredCount}</span>
                                <span className="legend-text">Answered</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-box not-answered">{notAnsweredCount > 0 ? notAnsweredCount : 0}</span>
                                <span className="legend-text">Not Answered</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-box not-visited">{notVisitedCount}</span>
                                <span className="legend-text">Not Visited</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-box marked">{markedCount - answeredMarkedCount}</span>
                                <span className="legend-text">Marked for Review</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-box answered-marked">{answeredMarkedCount}</span>
                                <span className="legend-text">Answered & Marked</span>
                            </div>
                        </div>

                        {/* Section Header */}
                        <div className="cat-section-header">
                            <span>Quant</span>
                        </div>

                        {/* Question Grid */}
                        <div className="cat-nav-title">Choose a Question</div>
                        <div className="cat-question-grid">
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    className={`grid-btn ${getQuestionStatus(i)} ${i === currentQ ? 'current' : ''}`}
                                    onClick={() => goToQuestion(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            className="cat-submit-btn"
                            onClick={() => setShowSubmitConfirm(true)}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Submit Confirmation Modal */}
                {showSubmitConfirm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Submit Quiz?</h3>
                            <div className="modal-stats">
                                <p><strong>Answered:</strong> {answeredCount} / {questions.length}</p>
                                <p><strong>Unanswered:</strong> {questions.length - answeredCount}</p>
                                <p><strong>Marked for Review:</strong> {markedCount}</p>
                            </div>
                            <p className="modal-warning">Once submitted, you cannot change your answers.</p>
                            <div className="modal-actions">
                                <button
                                    className="modal-btn cancel"
                                    onClick={() => setShowSubmitConfirm(false)}
                                >
                                    Go Back
                                </button>
                                <button
                                    className="modal-btn confirm"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render result stage
    const renderResult = () => {
        const results = calculateResults();
        const percentage = Math.round((results.correct / results.total) * 100);

        return (
            <div className="result-container">
                <div className="result-header">
                    <h1>Quiz Complete! 🎉</h1>
                    <p>Here's how you performed</p>
                </div>

                <div className="score-card">
                    <div className="score-circle">
                        <span className="score-number">{results.correct}</span>
                        <span className="score-total">/ {results.total}</span>
                    </div>
                    <div className="score-percentage">{percentage}%</div>
                    <div className="score-label">
                        {percentage >= 80 ? 'Excellent! 🌟' :
                            percentage >= 60 ? 'Good Job! 👍' :
                                percentage >= 40 ? 'Keep Practicing! 📚' : 'Need More Work! 💪'}
                    </div>
                </div>

                <div className="result-stats">
                    <div className="result-stat correct">
                        <span className="stat-icon">✓</span>
                        <span className="stat-value">{results.correct}</span>
                        <span className="stat-name">Correct</span>
                    </div>
                    <div className="result-stat incorrect">
                        <span className="stat-icon">✗</span>
                        <span className="stat-value">{results.incorrect}</span>
                        <span className="stat-name">Incorrect</span>
                    </div>
                    <div className="result-stat unattempted">
                        <span className="stat-icon">○</span>
                        <span className="stat-value">{results.unattempted}</span>
                        <span className="stat-name">Unattempted</span>
                    </div>
                </div>

                <div className="solutions-section">
                    <h3>Question Analysis</h3>
                    {questions.map((q, i) => {
                        const userAnswer = answers[i];
                        const isCorrect = userAnswer && userAnswer.toString().toLowerCase() === q.answer.toString().toLowerCase();
                        const isExpanded = showSolutions[i];

                        return (
                            <div key={i} className={`solution-card ${isCorrect ? 'correct' : userAnswer ? 'incorrect' : 'unattempted'}`}>
                                <div
                                    className="solution-header"
                                    onClick={() => setShowSolutions({ ...showSolutions, [i]: !isExpanded })}
                                >
                                    <div className="solution-status">
                                        {isCorrect ? '✓' : userAnswer ? '✗' : '○'}
                                    </div>
                                    <div className="solution-info">
                                        <span className="solution-q">Q{i + 1}: {q.question.slice(0, 50)}...</span>
                                        <span className="solution-topic">{q.topic} • {q.difficulty} • {q.type || 'MCQ'}</span>
                                    </div>
                                    <div className="solution-toggle">
                                        {isExpanded ? '▲' : '▼'}
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="solution-body">
                                        <p className="full-question">{q.question}</p>
                                        {q.options && q.options.length > 0 && (
                                            <div className="options-review">
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className={`option-review ${opt.charAt(0) === q.answer ? 'correct-option' : ''}`}>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="answer-row">
                                            <span>Your Answer: <strong className={isCorrect ? 'correct' : 'incorrect'}>{userAnswer || 'Not Attempted'}</strong></span>
                                            <span>Correct Answer: <strong className="correct">{q.answer}</strong></span>
                                        </div>
                                        <div className="solution-text">
                                            <strong>Solution:</strong>
                                            <p>{q.solution}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="result-actions">
                    <button className="btn btn-secondary" onClick={resetQuiz}>
                        📄 Upload New Notes
                    </button>
                    <Link to="/" className="btn btn-primary">
                        🏠 Back to Home
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <main className={`notes-page ${stage === 'quiz' ? 'quiz-mode' : ''}`}>
            <div className="container">
                {stage === 'config' && (
                    <div className="page-header">
                        <Link to="/" className="back-link">← Back</Link>
                        <h1>Notes Quiz</h1>
                        <p>Upload your notes, get a personalized CAT-level quiz</p>
                    </div>
                )}

                {stage === 'config' && renderConfig()}
                {stage === 'loading' && renderLoading()}
                {stage === 'quiz' && renderQuiz()}
                {stage === 'result' && renderResult()}
            </div>
        </main>
    );
}
