import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PatternRecognition.css';

const patterns = [
    {
        id: 1,
        stem: 'Person A can complete a task in some days, A and B together complete it faster...',
        correct: 'Work & Time',
        options: ['Work & Time', 'Ratio', 'Partnership', 'Interest']
    },
    {
        id: 2,
        stem: 'A number leaves different remainders when divided by different divisors...',
        correct: 'Remainder',
        options: ['Remainder', 'LCM/HCF', 'Factors', 'Divisibility']
    },
    {
        id: 3,
        stem: 'Items arranged in a row such that two specific items are always/never together...',
        correct: 'Permutation',
        options: ['Permutation', 'Combination', 'Circular', 'Derangement']
    },
];

export default function PatternRecognition() {
    const [state, setState] = useState('start');
    const [idx, setIdx] = useState(0);
    const [timer, setTimer] = useState(5);
    const [answer, setAnswer] = useState(null);
    const [score, setScore] = useState(0);

    const pattern = patterns[idx];

    useEffect(() => {
        if (state !== 'playing' || timer <= 0) return;
        const t = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    setAnswer('timeout');
                    setState('feedback');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [state, timer]);

    const start = () => {
        setState('playing');
        setIdx(0);
        setScore(0);
        setTimer(5);
        setAnswer(null);
    };

    const pick = (opt) => {
        if (state !== 'playing') return;
        setAnswer(opt);
        setState('feedback');
        if (opt === pattern.correct) setScore(s => s + 1);
    };

    const next = () => {
        if (idx + 1 >= patterns.length) {
            setState('done');
        } else {
            setIdx(i => i + 1);
            setAnswer(null);
            setTimer(5);
            setState('playing');
        }
    };

    return (
        <main className="pattern-page">
            <div className="container">
                <div className="page-header">
                    <Link to="/" className="back">← Back</Link>
                    <h1>Pattern Training</h1>
                    <p>Identify structures in 5 seconds</p>
                </div>

                {state === 'start' && (
                    <div className="start-box">
                        <h2>5-Second Challenge</h2>
                        <p>See a structure. Identify the pattern.</p>
                        <button className="btn btn-primary" onClick={start}>Start</button>
                    </div>
                )}

                {(state === 'playing' || state === 'feedback') && (
                    <div className="game">
                        <div className="game-header">
                            <span>{idx + 1} / {patterns.length}</span>
                            <span>Score: {score}</span>
                        </div>

                        <div className="timer">{timer}</div>

                        <div className="stem">
                            <p>{pattern.stem}</p>
                        </div>

                        <div className="options">
                            {pattern.options.map(opt => (
                                <button
                                    key={opt}
                                    className={`option ${answer === opt ? 'selected' : ''} ${state === 'feedback' && opt === pattern.correct ? 'correct' : ''} ${state === 'feedback' && answer === opt && opt !== pattern.correct ? 'wrong' : ''}`}
                                    onClick={() => pick(opt)}
                                    disabled={state === 'feedback'}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        {state === 'feedback' && (
                            <button className="btn btn-primary" onClick={next}>
                                {idx + 1 >= patterns.length ? 'Done' : 'Next →'}
                            </button>
                        )}
                    </div>
                )}

                {state === 'done' && (
                    <div className="done-box">
                        <h2>{score} / {patterns.length}</h2>
                        <p>Patterns identified correctly</p>
                        <button className="btn btn-primary" onClick={start}>Try Again</button>
                    </div>
                )}
            </div>
        </main>
    );
}
