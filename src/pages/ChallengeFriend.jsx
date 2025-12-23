import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { simpleMathQuestions, getRandomQuestions } from '../data/questionBank';
import './ChallengeFriend.css';

const WINS_NEEDED = 5;
const TIME_PER_QUESTION = 15;

export default function ChallengeFriend() {
    const [stage, setStage] = useState('setup'); // setup, playing, round-result, result
    const [player1Name, setPlayer1Name] = useState('Player 1');
    const [player2Name, setPlayer2Name] = useState('Player 2');
    const [player1Wins, setPlayer1Wins] = useState(0);
    const [player2Wins, setPlayer2Wins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [player1Answer, setPlayer1Answer] = useState(null);
    const [player2Answer, setPlayer2Answer] = useState(null);
    const [player1Time, setPlayer1Time] = useState(null);
    const [player2Time, setPlayer2Time] = useState(null);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [roundResult, setRoundResult] = useState(null);
    const [questions] = useState(() => getRandomQuestions(simpleMathQuestions, 20));
    const [questionIndex, setQuestionIndex] = useState(0);
    const startTimeRef = useRef(null);

    const startGame = () => {
        if (!player1Name.trim()) setPlayer1Name('Player 1');
        if (!player2Name.trim()) setPlayer2Name('Player 2');
        setCurrentQuestion(questions[0]);
        setStage('playing');
        startTimeRef.current = Date.now();
        setTimeLeft(TIME_PER_QUESTION);
    };

    // Timer countdown
    useEffect(() => {
        if (stage !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [stage, questionIndex]);

    const handleTimeout = () => {
        // Both players who haven't answered get marked as wrong
        determineRoundWinner(player1Answer, player1Time, player2Answer, player2Time);
    };

    const handlePlayer1Answer = (answer) => {
        if (player1Answer !== null) return;
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const isCorrect = answer === currentQuestion.answer;
        setPlayer1Answer(isCorrect ? answer : 'wrong');
        setPlayer1Time(isCorrect ? timeTaken : null);

        // Check if both players have answered
        if (player2Answer !== null) {
            setTimeout(() => {
                determineRoundWinner(
                    isCorrect ? answer : 'wrong',
                    isCorrect ? timeTaken : null,
                    player2Answer,
                    player2Time
                );
            }, 300);
        }
    };

    const handlePlayer2Answer = (answer) => {
        if (player2Answer !== null) return;
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const isCorrect = answer === currentQuestion.answer;
        setPlayer2Answer(isCorrect ? answer : 'wrong');
        setPlayer2Time(isCorrect ? timeTaken : null);

        // Check if both players have answered
        if (player1Answer !== null) {
            setTimeout(() => {
                determineRoundWinner(
                    player1Answer,
                    player1Time,
                    isCorrect ? answer : 'wrong',
                    isCorrect ? timeTaken : null
                );
            }, 300);
        }
    };

    const determineRoundWinner = (p1Ans, p1Time, p2Ans, p2Time) => {
        const p1Correct = p1Ans !== null && p1Ans !== 'wrong';
        const p2Correct = p2Ans !== null && p2Ans !== 'wrong';

        let winner = null;

        if (p1Correct && !p2Correct) {
            winner = 1;
            setPlayer1Wins(prev => prev + 1);
        } else if (!p1Correct && p2Correct) {
            winner = 2;
            setPlayer2Wins(prev => prev + 1);
        } else if (p1Correct && p2Correct) {
            // Both correct - faster wins
            if (p1Time < p2Time) {
                winner = 1;
                setPlayer1Wins(prev => prev + 1);
            } else if (p2Time < p1Time) {
                winner = 2;
                setPlayer2Wins(prev => prev + 1);
            }
            // If same time, it's a draw
        }

        setRoundResult({
            winner,
            p1Correct,
            p2Correct,
            p1Time: p1Time?.toFixed(1),
            p2Time: p2Time?.toFixed(1),
            answer: currentQuestion.answer
        });

        // Check for game winner
        const newP1Wins = player1Wins + (winner === 1 ? 1 : 0);
        const newP2Wins = player2Wins + (winner === 2 ? 1 : 0);

        if (newP1Wins >= WINS_NEEDED || newP2Wins >= WINS_NEEDED) {
            setStage('result');
        } else {
            setStage('round-result');
        }
    };

    const nextRound = () => {
        const nextIndex = questionIndex + 1;
        if (nextIndex >= questions.length) {
            setQuestionIndex(0);
            setCurrentQuestion(questions[0]);
        } else {
            setQuestionIndex(nextIndex);
            setCurrentQuestion(questions[nextIndex]);
        }
        setPlayer1Answer(null);
        setPlayer2Answer(null);
        setPlayer1Time(null);
        setPlayer2Time(null);
        setRoundResult(null);
        setTimeLeft(TIME_PER_QUESTION);
        startTimeRef.current = Date.now();
        setStage('playing');
    };

    const playAgain = () => {
        setPlayer1Wins(0);
        setPlayer2Wins(0);
        setQuestionIndex(0);
        setCurrentQuestion(questions[0]);
        setPlayer1Answer(null);
        setPlayer2Answer(null);
        setPlayer1Time(null);
        setPlayer2Time(null);
        setRoundResult(null);
        setTimeLeft(TIME_PER_QUESTION);
        startTimeRef.current = Date.now();
        setStage('playing');
    };

    // Setup Screen
    if (stage === 'setup') {
        return (
            <main className="challenge-page">
                <div className="setup-container">
                    <Link to="/arcade" className="back-link">← Back to Arcade</Link>
                    <h1 className="setup-title">Challenge Friend</h1>
                    <p className="setup-subtitle">First to {WINS_NEEDED} wins!</p>

                    <div className="mobile-notice">
                        <span className="notice-icon">📱</span>
                        <p>Best played on mobile! Each player uses one half of the screen.</p>
                    </div>

                    <div className="player-inputs">
                        <div className="player-input">
                            <span className="player-number">P1 (Top)</span>
                            <input
                                type="text"
                                placeholder="Player 1"
                                value={player1Name}
                                onChange={(e) => setPlayer1Name(e.target.value)}
                                maxLength={12}
                            />
                        </div>
                        <div className="vs-badge">VS</div>
                        <div className="player-input">
                            <span className="player-number">P2 (Bottom)</span>
                            <input
                                type="text"
                                placeholder="Player 2"
                                value={player2Name}
                                onChange={(e) => setPlayer2Name(e.target.value)}
                                maxLength={12}
                            />
                        </div>
                    </div>

                    <div className="rules-box">
                        <h3>How to Play</h3>
                        <ul>
                            <li>Screen splits into two halves</li>
                            <li>Each player plays from their side</li>
                            <li>Answer the same question simultaneously</li>
                            <li>Faster correct answer wins the round!</li>
                        </ul>
                    </div>

                    <button className="start-btn" onClick={startGame}>
                        <span>⚡</span> Start Battle
                    </button>
                </div>
            </main>
        );
    }

    // Round Result Screen
    if (stage === 'round-result') {
        const winnerName = roundResult.winner === 1 ? player1Name :
            roundResult.winner === 2 ? player2Name : null;

        return (
            <main className="challenge-page">
                <div className="round-result-container">
                    <div className="result-header">
                        {roundResult.winner ? (
                            <>
                                <span className="winner-icon">🏆</span>
                                <h2>{winnerName} wins!</h2>
                            </>
                        ) : (
                            <>
                                <span className="draw-icon">🤝</span>
                                <h2>It's a draw!</h2>
                            </>
                        )}
                    </div>

                    <div className="round-comparison">
                        <div className="comparison-side">
                            <span className="comparison-name">{player1Name}</span>
                            <span className={`comparison-result ${roundResult.p1Correct ? 'correct' : 'wrong'}`}>
                                {roundResult.p1Correct ? `✓ ${roundResult.p1Time}s` : '✕ Wrong'}
                            </span>
                        </div>
                        <div className="comparison-answer">
                            Answer: {roundResult.answer}
                        </div>
                        <div className="comparison-side">
                            <span className="comparison-name">{player2Name}</span>
                            <span className={`comparison-result ${roundResult.p2Correct ? 'correct' : 'wrong'}`}>
                                {roundResult.p2Correct ? `✓ ${roundResult.p2Time}s` : '✕ Wrong'}
                            </span>
                        </div>
                    </div>

                    <div className="score-tracker">
                        <div className="tracker-side">
                            <span className="tracker-wins">{player1Wins}</span>
                            <span className="tracker-name">{player1Name}</span>
                        </div>
                        <span className="tracker-vs">-</span>
                        <div className="tracker-side">
                            <span className="tracker-wins">{player2Wins}</span>
                            <span className="tracker-name">{player2Name}</span>
                        </div>
                    </div>

                    <button className="next-round-btn" onClick={nextRound}>
                        Next Round →
                    </button>
                </div>
            </main>
        );
    }

    // Final Result Screen
    if (stage === 'result') {
        const winner = player1Wins >= WINS_NEEDED ? player1Name : player2Name;
        const winnerWins = Math.max(player1Wins, player2Wins);
        const loserWins = Math.min(player1Wins, player2Wins);

        return (
            <main className="challenge-page">
                <div className="final-result-container">
                    <div className="celebration">
                        <span className="trophy">🏆</span>
                        <h1 className="winner-name">{winner}</h1>
                        <p className="winner-title">CHAMPION</p>
                    </div>

                    <div className="final-score">
                        <span className="final-score-text">{winnerWins} - {loserWins}</span>
                    </div>

                    <div className="final-actions">
                        <button className="rematch-btn" onClick={playAgain}>
                            <span>🔄</span> Rematch
                        </button>
                        <Link to="/arcade" className="exit-btn">
                            <span>🏠</span> Exit
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Split Screen Playing Mode
    return (
        <main className="challenge-page split-screen">
            {/* Player 1 Side (Top - rotated 180 degrees) */}
            <div className="player-half player1-half">
                <div className="half-header">
                    <span className="half-name">{player1Name}</span>
                    <span className="half-score">{player1Wins}</span>
                </div>

                <div className="half-question">
                    <p>{currentQuestion?.question}</p>
                </div>

                <div className="half-options">
                    {currentQuestion?.options.map((opt, i) => (
                        <button
                            key={i}
                            className={`half-option ${player1Answer === opt ? 'selected correct' : ''} ${player1Answer === 'wrong' ? 'disabled' : ''}`}
                            onClick={() => handlePlayer1Answer(opt)}
                            disabled={player1Answer !== null}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {player1Answer && (
                    <div className="waiting-badge">
                        {player2Answer ? 'Done!' : 'Waiting for opponent...'}
                    </div>
                )}
            </div>

            {/* Center Divider with Timer */}
            <div className="center-divider">
                <div className={`center-timer ${timeLeft <= 5 ? 'danger' : ''}`}>
                    {timeLeft}
                </div>
                <div className="center-score">
                    {player1Wins} - {player2Wins}
                </div>
            </div>

            {/* Player 2 Side (Bottom - normal orientation) */}
            <div className="player-half player2-half">
                <div className="half-header">
                    <span className="half-name">{player2Name}</span>
                    <span className="half-score">{player2Wins}</span>
                </div>

                <div className="half-question">
                    <p>{currentQuestion?.question}</p>
                </div>

                <div className="half-options">
                    {currentQuestion?.options.map((opt, i) => (
                        <button
                            key={i}
                            className={`half-option ${player2Answer === opt ? 'selected correct' : ''} ${player2Answer === 'wrong' ? 'disabled' : ''}`}
                            onClick={() => handlePlayer2Answer(opt)}
                            disabled={player2Answer !== null}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {player2Answer && (
                    <div className="waiting-badge">
                        {player1Answer ? 'Done!' : 'Waiting for opponent...'}
                    </div>
                )}
            </div>
        </main>
    );
}
