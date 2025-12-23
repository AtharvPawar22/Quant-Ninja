import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { questions, getRandomQuestions } from '../data/questionBank';
import './Classic1v1.css';

const TOTAL_QUESTIONS = 5;
const TIME_PER_QUESTION = 60;
const BOT_NAMES = ['Bot_Alpha', 'QuantMaster', 'MathNinja', 'CalcBot', 'QuickSolver'];

export default function Classic1v1() {
    const [stage, setStage] = useState('lobby'); // lobby, battle, result
    const [gameQuestions, setGameQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [playerScore, setPlayerScore] = useState(0);
    const [botScore, setBotScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [botAnswering, setBotAnswering] = useState(true);
    const [botName] = useState(BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]);
    const [sessionId] = useState(`QN-${Math.floor(Math.random() * 9000) + 1000}`);
    const [questionLog, setQuestionLog] = useState([]);
    const [scoreAnimation, setScoreAnimation] = useState(null);
    const [confetti, setConfetti] = useState(false);
    const [expandedSolutions, setExpandedSolutions] = useState({});
    const [showHint, setShowHint] = useState(false);
    const [botScoreLog, setBotScoreLog] = useState([]);

    // Initialize game
    const startGame = useCallback(() => {
        const qs = getRandomQuestions(questions, TOTAL_QUESTIONS);
        setGameQuestions(qs);
        setCurrentQ(0);
        setTimeLeft(TIME_PER_QUESTION);
        setPlayerScore(0);
        setBotScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuestionLog([]);
        setBotScoreLog([]);
        setShowHint(false);
        setStage('battle');
    }, []);

    // Lobby countdown
    useEffect(() => {
        if (stage === 'lobby') {
            const timer = setTimeout(() => startGame(), 2500);
            return () => clearTimeout(timer);
        }
    }, [stage, startGame]);

    // Timer countdown
    useEffect(() => {
        if (stage !== 'battle' || showResult) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [stage, showResult, currentQ]);

    // Bot "thinking" - HARD difficulty (85% accuracy, fast responses)
    useEffect(() => {
        if (stage !== 'battle') return;
        setBotAnswering(true);
        const thinkTime = Math.random() * 9000 + 3000; // 3-12 seconds (faster)
        const timer = setTimeout(() => {
            setBotAnswering(false);
            // Bot scores based on HARD difficulty - 85% accuracy
            const botCorrect = Math.random() > 0.15;
            if (!showResult) {
                const botPoints = botCorrect ? Math.floor(Math.random() * 25) + 75 : 0; // 75-99 points or 0
                setBotScore(prev => prev + botPoints);
                setBotScoreLog(prev => [...prev, botPoints]);
            }
        }, thinkTime);
        return () => clearTimeout(timer);
    }, [currentQ, stage]);

    const handleTimeout = () => {
        if (showResult) return;
        logQuestion(null, TIME_PER_QUESTION, 0);
        setShowResult(true);
    };

    const handleAnswer = (answer) => {
        if (showResult || selectedAnswer) return;

        setSelectedAnswer(answer);
        const q = gameQuestions[currentQ];
        const isCorrect = answer === q.answer;
        const timeTaken = TIME_PER_QUESTION - timeLeft;
        const points = isCorrect ? Math.max(100 - timeTaken, 10) : 0;

        if (isCorrect) {
            setPlayerScore(prev => prev + points);
            setScoreAnimation(`+${points}`);
            setConfetti(true);
            setTimeout(() => {
                setScoreAnimation(null);
                setConfetti(false);
            }, 1500);
        }

        logQuestion(answer, timeTaken, points);
        setShowResult(true);
        setShowHint(false);
    };

    const logQuestion = (answer, timeTaken, points) => {
        const q = gameQuestions[currentQ];
        setQuestionLog(prev => [...prev, {
            question: q.question,
            category: q.category,
            userAnswer: answer,
            correctAnswer: q.answer,
            isCorrect: answer === q.answer,
            timeTaken,
            points,
            solution: q.solution
        }]);
    };

    const nextQuestion = () => {
        if (currentQ + 1 >= TOTAL_QUESTIONS) {
            setStage('result');
        } else {
            setCurrentQ(prev => prev + 1);
            setTimeLeft(TIME_PER_QUESTION);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    };

    const playAgain = () => {
        setStage('lobby');
    };

    // Render based on stage
    if (stage === 'lobby') {
        return (
            <main className="classic-page">
                <div className="lobby">
                    <div className="lobby-spinner"></div>
                    <h2>Finding opponent...</h2>
                    <p>Matching you with a worthy challenger</p>
                </div>
            </main>
        );
    }

    if (stage === 'result') {
        const playerWon = playerScore > botScore;
        const avgTime = questionLog.length > 0
            ? (questionLog.reduce((sum, q) => sum + q.timeTaken, 0) / questionLog.length).toFixed(1)
            : 0;
        const fastestTime = questionLog.length > 0
            ? Math.min(...questionLog.filter(q => q.isCorrect).map(q => q.timeTaken), 99)
            : 0;
        const accuracy = questionLog.filter(q => q.isCorrect).length;

        return (
            <main className="classic-page">
                <div className="result-container">
                    <div className={`result-banner ${playerWon ? 'victory' : 'defeat'}`}>
                        <h1>{playerWon ? 'VICTORY' : 'DEFEAT'}</h1>
                        <p>Match Analysis</p>
                    </div>

                    <div className="score-comparison">
                        <div className="score-side you">
                            <span className="score-label">YOU</span>
                            <span className="score-value">{playerScore}</span>
                            <span className={`rating-change ${playerWon ? 'positive' : 'negative'}`}>
                                {playerWon ? '+15' : '-12'} Rating
                            </span>
                        </div>
                        <div className="score-divider"></div>
                        <div className="score-side opponent">
                            <span className="score-label">OPPONENT</span>
                            <span className="score-value">{botScore}</span>
                            <span className="bot-name">{botName}</span>
                        </div>
                    </div>

                    <div className="performance-chart">
                        <div className="chart-header">
                            <span className="chart-icon">📈</span>
                            <span className="chart-title">Performance Timeline</span>
                            <div className="chart-legend">
                                <span className="legend-you">— You</span>
                                <span className="legend-bot">— Bot</span>
                            </div>
                        </div>
                        <div className="chart-placeholder">
                            {/* Simple visual representation */}
                            <div className="chart-bars">
                                {questionLog.map((q, i) => (
                                    <div key={i} className="chart-bar-group">
                                        <div
                                            className="chart-bar you-bar"
                                            style={{ height: `${Math.min(q.points, 100)}%` }}
                                            title={`You: ${q.points} pts`}
                                        ></div>
                                        <div
                                            className="chart-bar bot-bar"
                                            style={{ height: `${Math.min(botScoreLog[i] || 0, 100)}%` }}
                                            title={`Bot: ${botScoreLog[i] || 0} pts`}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="chart-labels">
                                <span>Start</span>
                                {questionLog.map((_, i) => (
                                    <span key={i}>Q{i + 1}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="stats-row">
                        <div className="stat-box">
                            <span className="stat-icon">⏱️</span>
                            <span className="stat-num">{avgTime}s</span>
                            <span className="stat-txt">AVG TIME</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-icon">⚡</span>
                            <span className="stat-num">{fastestTime === 99 ? '--' : `${fastestTime}s`}</span>
                            <span className="stat-txt">FASTEST</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-icon">📊</span>
                            <span className="stat-num">{accuracy}/{TOTAL_QUESTIONS}</span>
                            <span className="stat-txt">ACCURACY</span>
                        </div>
                    </div>

                    <div className="detailed-log">
                        <h3 className="log-title">Detailed Log</h3>
                        <p className="log-subtitle">Tap any question to see the detailed solution</p>

                        {questionLog.map((q, i) => (
                            <div key={i} className={`log-item ${q.isCorrect ? 'correct' : 'wrong'}`}>
                                <div className={`log-icon ${q.isCorrect ? 'correct' : 'wrong'}`}>
                                    {q.isCorrect ? '✓' : '✕'}
                                </div>
                                <div className="log-info">
                                    <span className="log-question">Question {i + 1}</span>
                                    <span className="log-stats">{q.timeTaken}s • {q.points} pts</span>
                                </div>
                                <button
                                    className="view-solution"
                                    onClick={() => setExpandedSolutions(prev => ({ ...prev, [i]: !prev[i] }))}
                                >
                                    {expandedSolutions[i] ? 'Hide Solution ↑' : 'View Solution →'}
                                </button>
                                {expandedSolutions[i] && q.solution && (
                                    <div className="solution-text">
                                        <span className="solution-label">Solution</span>
                                        {q.solution}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="result-actions">
                        <button className="action-btn secondary" onClick={playAgain}>
                            <span>🔄</span> New Game
                        </button>
                        <Link to="/arcade" className="action-btn primary">
                            <span>🎮</span> Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Battle stage
    const q = gameQuestions[currentQ];
    const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;

    return (
        <main className="classic-page">
            {confetti && <div className="confetti-container">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="confetti" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        backgroundColor: ['#00d4aa', '#8a2be2', '#ff6b6b', '#ffd93d'][Math.floor(Math.random() * 4)]
                    }}></div>
                ))}
            </div>}

            <div className="battle-layout">
                <div className="question-panel">
                    <div className="question-header">
                        <span className="category-badge">{q?.category}</span>
                        <div className="timer-circle">
                            <svg viewBox="0 0 100 100">
                                <circle className="timer-bg" cx="50" cy="50" r="45" />
                                <circle
                                    className="timer-progress"
                                    cx="50" cy="50" r="45"
                                    style={{
                                        strokeDasharray: `${timerPercent * 2.83} 283`,
                                        stroke: timeLeft <= 10 ? '#ff6b6b' : '#8a2be2'
                                    }}
                                />
                            </svg>
                            <span className="timer-text">{timeLeft}</span>
                            {scoreAnimation && (
                                <span className="score-popup">{scoreAnimation}</span>
                            )}
                        </div>
                    </div>

                    <div className="question-text">
                        <p>{q?.question}</p>
                    </div>

                    <div className="options-grid">
                        {q?.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`option-btn 
                                    ${selectedAnswer === opt ? 'selected' : ''} 
                                    ${showResult && opt === q.answer ? 'correct' : ''} 
                                    ${showResult && selectedAnswer === opt && opt !== q.answer ? 'wrong' : ''}`}
                                onClick={() => handleAnswer(opt)}
                                disabled={showResult}
                            >
                                {opt}
                                {showResult && opt === q.answer && <span className="check-icon">✓</span>}
                            </button>
                        ))}
                    </div>

                    <div className="question-footer">
                        <button
                            className={`hint-btn ${showHint ? 'active' : ''}`}
                            onClick={() => setShowHint(!showHint)}
                            disabled={showResult}
                        >
                            <span>💡</span> {showHint ? 'Hide Hint' : 'Hint'}
                        </button>
                        {showHint && q?.hint && (
                            <div className="hint-content">
                                <span className="hint-icon">💡</span>
                                <span>{q.hint}</span>
                            </div>
                        )}
                        {showResult && (
                            <button className="next-btn" onClick={nextQuestion}>
                                Next <span>→</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="sidebar">
                    <div className="score-card your-score">
                        <span className="score-title">CURRENT SCORE</span>
                        <span className="score-num">{playerScore}</span>
                    </div>

                    <div className="score-card opponent-score">
                        <div className="opponent-header">
                            <span className="score-title">OPPONENT</span>
                            <span className="score-num">{botScore}</span>
                        </div>
                        <div className="bot-info">
                            <div className="bot-avatar">AI</div>
                            <div className="bot-details">
                                <span className="bot-name">{botName}</span>
                                <span className="bot-status">
                                    {botAnswering ? '● Calculating...' : '● Answered'}
                                </span>
                            </div>
                        </div>
                        <div className="bot-progress">
                            <div
                                className="bot-progress-bar"
                                style={{ width: botAnswering ? '60%' : '100%' }}
                            ></div>
                        </div>
                    </div>

                    <div className="session-id">SESSION ID: {sessionId}</div>
                </div>
            </div>
        </main>
    );
}
