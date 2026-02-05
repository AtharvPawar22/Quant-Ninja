import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { hasApiKey, generateQuiz } from '../services/geminiService';
import '../styles/animations.css';
import './NotesQuiz.css';

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'difficult', 'mixture'];
const QUESTION_COUNT_OPTIONS = [5, 10, 20];
const MAX_FILES = 5; // Maximum files allowed

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
    const [filePreviews, setFilePreviews] = useState([]); // Image preview URLs
    const [notesText, setNotesText] = useState(''); // Manual text input
    const [difficulty, setDifficulty] = useState('medium');
    const [questionCount, setQuestionCount] = useState(5);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [loadingSubtext, setLoadingSubtext] = useState('');
    const [error, setError] = useState('');
    const [isPremiumMode, setIsPremiumMode] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

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

    // Handle file upload with previews
    const handleFileUpload = (e) => {
        const newFiles = Array.from(e.target.files);
        addFilesWithPreviews(newFiles);
    };

    // Handle camera capture
    const handleCameraCapture = (e) => {
        const newFiles = Array.from(e.target.files);
        addFilesWithPreviews(newFiles);
    };

    // Add files with preview generation
    const addFilesWithPreviews = (newFiles) => {
        const validFiles = newFiles.filter(f =>
            f.type.startsWith('image/') || f.type === 'application/pdf'
        );

        // Limit to MAX_FILES
        const remainingSlots = MAX_FILES - files.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);

        if (filesToAdd.length < validFiles.length) {
            setError(`Maximum ${MAX_FILES} files allowed. Some files were not added.`);
        } else {
            setError('');
        }

        // Generate previews for images
        const newPreviews = filesToAdd.map(file => {
            if (file.type.startsWith('image/')) {
                return URL.createObjectURL(file);
            }
            return null; // PDF - no preview
        });

        setFiles([...files, ...filesToAdd]);
        setFilePreviews([...filePreviews, ...newPreviews]);
    };

    // Handle file drop
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFilesWithPreviews(droppedFiles);
    }, [files, filePreviews]);

    const handleDragOver = (e) => e.preventDefault();

    // Remove file and its preview
    const removeFile = (index) => {
        // Revoke the object URL to free memory
        if (filePreviews[index]) {
            URL.revokeObjectURL(filePreviews[index]);
        }
        setFiles(files.filter((_, i) => i !== index));
        setFilePreviews(filePreviews.filter((_, i) => i !== index));
    };

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            filePreviews.forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    // Generate quiz
    const handleGenerateQuiz = async () => {
        if (files.length === 0 && !notesText.trim()) {
            setError('Please upload notes or type your notes content below');
            return;
        }

        setStage('loading');
        setError('');

        // Check if using premium mode (Gemini API available)
        const premium = hasApiKey();
        setIsPremiumMode(premium);

        if (premium) {
            setLoadingMessage('🧠 Understanding your notes deeply...');
            setLoadingSubtext('Using AI to analyze concepts, not just keywords');
        } else {
            setLoadingMessage('📖 Analyzing your notes...');
            setLoadingSubtext('Extracting text and matching questions');
        }

        try {
            // Premium loading messages
            if (premium) {
                setTimeout(() => {
                    setLoadingMessage('🔍 Identifying mathematical concepts...');
                    setLoadingSubtext('Understanding what your notes are really teaching');
                }, 2500);
                setTimeout(() => {
                    setLoadingMessage('📐 Detecting formulas and their purposes...');
                    setLoadingSubtext('Mapping to CAT 2024-2026 patterns');
                }, 5000);
                setTimeout(() => {
                    setLoadingMessage('🎯 Finding perfectly matched questions...');
                    setLoadingSubtext('Excluding irrelevant topics, selecting best fits');
                }, 8000);
            } else {
                setTimeout(() => setLoadingMessage('Reading your notes carefully...'), 2000);
                setTimeout(() => setLoadingMessage('Extracting formulas and concepts...'), 4000);
                setTimeout(() => setLoadingMessage('Finding relevant CAT questions...'), 7000);
            }

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
        // Cleanup preview URLs
        filePreviews.forEach(url => {
            if (url) URL.revokeObjectURL(url);
        });

        setStage('config');
        setFiles([]);
        setFilePreviews([]);
        setNotesText('');
        setQuestions([]);
        setAnswers({});
        setTitaInputs({});
        setMarkedForReview(new Set());
        setVisitedQuestions(new Set([0]));
        setShowSolutions({});
        setIsPremiumMode(false);
    };

    // Render config stage
    const renderConfig = () => (
        <div className="config-container">
            {/* Premium badge if API available */}
            {hasApiKey() && (
                <div className="premium-badge">
                    <span className="badge-icon">🧠</span>
                    <span className="badge-text">AI-Powered Concept Analysis Active</span>
                </div>
            )}

            <div className="config-section">
                <div className="section-header">
                    <h3>Upload Notes</h3>
                    <span className="file-count">{files.length}/{MAX_FILES} files</span>
                </div>

                {/* Upload buttons row */}
                <div className="upload-buttons-row">
                    {/* Camera capture button (primarily for mobile) */}
                    <button
                        className="upload-method-btn camera-btn"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={files.length >= MAX_FILES}
                    >
                        <span className="btn-icon">📸</span>
                        <span className="btn-label">Take Photo</span>
                    </button>
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        hidden
                    />

                    {/* File upload button */}
                    <button
                        className="upload-method-btn file-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={files.length >= MAX_FILES}
                    >
                        <span className="btn-icon">📁</span>
                        <span className="btn-label">Browse Files</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,application/pdf"
                        multiple
                        hidden
                    />
                </div>

                {/* Drop zone */}
                <div
                    className={`upload-zone ${files.length >= MAX_FILES ? 'disabled' : ''}`}
                    onClick={() => files.length < MAX_FILES && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <div className="upload-icon-box">📄</div>
                    <p className="upload-text">
                        {files.length >= MAX_FILES
                            ? 'Maximum files reached'
                            : 'Drop files here or click to browse'}
                    </p>
                    <p className="upload-hint">Upload up to {MAX_FILES} images or PDFs • Handwritten notes supported</p>
                </div>

                {/* Image preview grid */}
                {files.length > 0 && (
                    <div className="image-preview-grid">
                        {files.map((file, i) => (
                            <div key={i} className="preview-card">
                                {filePreviews[i] ? (
                                    <img
                                        src={filePreviews[i]}
                                        alt={`Note ${i + 1}`}
                                        className="preview-image"
                                    />
                                ) : (
                                    <div className="preview-placeholder">
                                        <span className="pdf-icon">📄</span>
                                        <span className="pdf-label">PDF</span>
                                    </div>
                                )}
                                <div className="preview-overlay">
                                    <span className="file-num">{i + 1}</span>
                                    <button
                                        className="remove-btn"
                                        onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                        title="Remove"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="preview-filename">{file.name.slice(0, 15)}...</div>
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
                Generate Quiz
            </button>
        </div>
    );

    // Render loading stage
    const renderLoading = () => (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>{loadingMessage}</h2>
            <div className="progress-bar-container">
                <div className="progress-bar-fill"></div>
            </div>
            <p className="loading-subtext">
                {loadingSubtext || `Analyzing your ${files.length > 0 ? `${files.length} image(s)` : 'notes'} for CAT patterns...`}
            </p>
            {isPremiumMode && (
                <div className="premium-loading-indicator">
                    <span className="ai-chip">🧠 AI-Powered</span>
                </div>
            )}
        </div>
    );

    // Render quiz stage - CAT Exam Style
    const renderQuiz = () => {
        const q = questions[currentQ];
        if (!q) return null;

        const answeredCount = Object.keys(answers).length;
        const answeredMarkedCount = [...markedForReview].filter(i => answers[i] !== undefined).length;
        const markedCount = markedForReview.size - answeredMarkedCount;
        const visitedTotal = visitedQuestions.size;
        const notAnsweredCount = visitedTotal - Object.keys(answers).filter(i => visitedQuestions.has(parseInt(i))).length;
        const notVisitedCount = questions.length - visitedTotal;
        const isTITA = q.type === 'TITA';

        return (
            <div className="cat-quiz-container">
                {/* Top Header Bar */}
                <div className="cat-header">
                    <div className="cat-section-tabs">
                        <button className="section-tab">Quant</button>
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
                    <span className="question-type">Question Type: {isTITA ? 'TITA' : 'MCQ'}</span>
                    <span className="question-marks">Marks for correct answer: 3 | Negative Marks: {isTITA ? '0' : '1'}</span>
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
                                    onClick={() => {
                                        if (currentQ < questions.length - 1) {
                                            handleNext();
                                        } else {
                                            setShowSubmitConfirm(true);
                                        }
                                    }}
                                >
                                    {currentQ === questions.length - 1 ? 'Save & Submit' : 'Save & Next'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Navigator */}
                    <div className="cat-sidebar">
                        {/* Stats Legend */}
                        <div className="cat-stats-legend">
                            <div className="legend-item">
                                <span className="legend-box answered">{Object.keys(answers).filter(i => !markedForReview.has(parseInt(i))).length}</span>
                                <span className="legend-text">Answered</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-box not-answered">{notAnsweredCount}</span>
                                <span className="legend-text">Not Answered</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-box not-visited">{notVisitedCount}</span>
                                <span className="legend-text">Not Visited</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-box marked">{markedCount}</span>
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
                                <p><strong>Marked for Review:</strong> {markedForReview.size}</p>
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
                    <h1>Analysis Complete</h1>
                    <p>Performance on CAT {difficulty === 'mixture' ? 'Level' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Questions</p>
                </div>

                <div className="score-summary-grid">
                    <div className="score-card main-score">
                        <div className="score-circle">
                            <span className="score-number">{results.correct}</span>
                            <span className="score-total">/ {results.total}</span>
                        </div>
                        <div className="score-label">
                            {percentage >= 90 ? 'Mastery Level' :
                                percentage >= 75 ? 'Advanced Proficiency' :
                                    percentage >= 50 ? 'Strong Foundation' : 'Review Required'}
                        </div>
                    </div>

                    <div className="quick-stats">
                        <div className="stat-box">
                            <span className="stat-val">{results.correct}</span>
                            <span className="stat-name">Correct</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-val">{results.incorrect}</span>
                            <span className="stat-name">Incorrect</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-val">{results.unattempted}</span>
                            <span className="stat-name">Skipped</span>
                        </div>
                    </div>
                </div>

                <div className="analysis-breakdown">
                    <h3>Performance Insights</h3>
                    <div className="insights-grid">
                        <div className="insight-card">
                            <span className="insight-text">Accuracy: {percentage}%</span>
                        </div>
                        <div className="insight-card">
                            <span className="insight-text">Avg Time: {formatTime(Math.max(0, (getTimerDuration(questionCount) - timeLeft) / (results.total - results.unattempted || 1)))} / question</span>
                        </div>
                    </div>
                </div>

                <div className="solutions-section">
                    <h3>Solutions & Analysis</h3>
                    {questions.map((q, i) => {
                        const userAnswer = answers[i];
                        const isCorrect = userAnswer && userAnswer.toString().toLowerCase() === q.answer.toString().toLowerCase();
                        const isExpanded = showSolutions[i];
                        const isTITA = q.type === 'TITA';

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
                                        <div className="solution-meta">
                                            <span className="tag-pill source-tag">CAT {q.year}</span>
                                            <span className="tag-pill diff-tag">{q.difficulty}</span>
                                            {q.relevanceScore && <span className="tag-pill rel-tag">Match: {Math.round(q.relevanceScore)}%</span>}
                                        </div>
                                        <div className="solution-q-text">{q.question.slice(0, 80)}...</div>
                                    </div>
                                    <div className="solution-toggle">
                                        {isExpanded ? 'Collapse' : 'View Solution'} {isExpanded ? '▲' : '▼'}
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="solution-body">
                                        <div className="q-content-box">
                                            <strong>Question {i + 1}:</strong>
                                            <p className="full-question">{q.question}</p>
                                        </div>

                                        {q.options && q.options.length > 0 && (
                                            <div className="options-review">
                                                {q.options.map((opt, oi) => {
                                                    const optionLetter = opt.charAt(0);
                                                    const isUserChoice = userAnswer === optionLetter;
                                                    const isCorrectOpt = optionLetter === q.answer;

                                                    return (
                                                        <div key={oi} className={`option-review ${isCorrectOpt ? 'correct-option' : ''} ${isUserChoice && !isCorrectOpt ? 'wrong-option' : ''}`}>
                                                            {opt}
                                                            {isUserChoice && <span className="selection-badge">Your Choice</span>}
                                                            {isCorrectOpt && <span className="correct-badge">Correct Answer</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="answer-summary">
                                            <div className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                                <span>Your Answer:</span>
                                                <strong>{userAnswer || 'Not Attempted'}</strong>
                                            </div>
                                            <div className="answer-item correct">
                                                <span>Correct Answer:</span>
                                                <strong>{q.answer}</strong>
                                            </div>
                                        </div>

                                        <div className="solution-explanation">
                                            <div className="explanation-header">Ninja Insight & Full Solution</div>
                                            <div className="explanation-content whitespace-pre-wrap">
                                                {q.solution}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="result-actions">
                    <button className="btn btn-secondary" onClick={resetQuiz}>
                        Upload New Notes
                    </button>
                    <Link to="/" className="btn btn-primary">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <main className={`notes-page ${stage === 'quiz' ? 'quiz-mode' : ''}`}>
            {stage !== 'quiz' && <div className="ink-wash"></div>}
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
