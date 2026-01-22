import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PATTERNS, CATEGORIES, DIFFICULTIES } from '../data/patterns';
import { questions as PYQS } from '../data/cat-pyq';
import './PatternRecognition.css';

export default function PatternRecognition() {
    const [state, setState] = useState('start'); // start, playing, pyq, solution, variant, done
    const [config, setConfig] = useState({ category: 'ALL', difficulty: 'intermediate' });
    const [sessionPatterns, setSessionPatterns] = useState([]);
    const [idx, setIdx] = useState(0);
    const [timer, setTimer] = useState(0);
    const [answer, setAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState([]); // Track performance: { patternId, correct, time, variantCorrect }
    const [showSolution, setShowSolution] = useState(false);
    const [variantResult, setVariantResult] = useState(null); // null, correct, wrong

    // Filter and shuffle patterns based on config
    const prepareSession = () => {
        let filtered = config.category === 'ALL'
            ? [...PATTERNS]
            : PATTERNS.filter(p => p.category === config.category);

        // Shuffle and pick 10
        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 10).map(p => {
            const variant = p.variants ? p.variants[Math.floor(Math.random() * p.variants.length)] : null;
            return {
                ...p,
                shuffledOptions: p.distractors ? p.distractors.concat(p.name).sort(() => Math.random() - 0.5) : [],
                activeVariant: variant
            };
        });

        setSessionPatterns(shuffled);
        setIdx(0);
        setScore(0);
        setHistory([]);
        startFlash(shuffled[0]);
    };

    const startFlash = (pattern) => {
        const diff = DIFFICULTIES.find(d => d.id === config.difficulty);
        setTimer(diff.time);
        setAnswer(null);
        setVariantResult(null);
        setShowSolution(false);
        setState('playing');
    };

    useEffect(() => {
        if (state !== 'playing' || timer <= 0 || answer !== null) return;
        const t = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    handleAnswer('timeout');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [state, timer, answer]);

    const handleAnswer = (opt) => {
        if (state !== 'playing' || answer !== null) return;
        setAnswer(opt);
        const currentPattern = sessionPatterns[idx];
        const diff = DIFFICULTIES.find(d => d.id === config.difficulty);
        const timeTaken = diff.time - timer;
        const isCorrect = opt === currentPattern.name;

        if (isCorrect) setScore(s => s + 1);

        setHistory(prev => [...prev, {
            patternId: currentPattern.id,
            patternName: currentPattern.name,
            category: currentPattern.category,
            correct: isCorrect,
            responseTime: timeTaken,
            variantCorrect: null
        }]);

        setTimeout(() => {
            setState('pyq');
        }, 1200);
    };

    const currentPattern = sessionPatterns[idx];
    const matchingPyq = useMemo(() => {
        if (!currentPattern) return null;
        return PYQS.find(q => q.id === currentPattern.pyqId);
    }, [currentPattern]);

    const handleVariantGuess = (isCorrect) => {
        setVariantResult(isCorrect ? 'correct' : 'wrong');

        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[idx].variantCorrect = isCorrect;
            return newHistory;
        });

        setTimeout(() => {
            next();
        }, 1500);
    };

    const next = () => {
        if (idx + 1 >= sessionPatterns.length) {
            setState('done');
            // Save to total history in localStorage
            const savedHistory = JSON.parse(localStorage.getItem('qn_pattern_history') || '[]');
            const newGlobalHistory = [...savedHistory, ...history];
            localStorage.setItem('qn_pattern_history', JSON.stringify(newGlobalHistory.slice(-500))); // keep last 500
        } else {
            const nextIdx = idx + 1;
            setIdx(nextIdx);
            startFlash(sessionPatterns[nextIdx]);
        }
    };

    const highlightTriggers = (text, triggers) => {
        if (!triggers || !text) return text;
        let highlighted = text;
        triggers.forEach(t => {
            const regex = new RegExp(`(${t})`, 'gi');
            highlighted = highlighted.replace(regex, '<span class="trigger-highlight">$1</span>');
        });
        return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
    };

    const renderSolutionSteps = (solutionText) => {
        if (!solutionText) return null;
        let rawSteps = solutionText.includes('=>')
            ? solutionText.split('=>')
            : solutionText.split(/\. (?=[A-Z0-9])/);

        let steps = [];
        rawSteps.forEach(s => {
            let chunk = s.trim();
            if (!chunk) return;
            if (chunk.length < 25 && steps.length > 0) {
                steps[steps.length - 1] += (solutionText.includes('=>') ? " => " : " ") + chunk;
            } else {
                steps.push(chunk);
            }
        });
        steps = steps.map(s => (s.endsWith('.') || s.includes('=') ? s : s + '.'));
        if (steps.length > 5) {
            steps = [...steps.slice(0, 4), steps.slice(4).join(' ')];
        }

        return (
            <div className="solution-steps">
                {steps.map((step, i) => (
                    <div key={i} className="solution-step">
                        <span className="step-number">{i + 1}</span>
                        <p>{step}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <main className="pattern-page">
            <div className="container">
                <div className="page-header">
                    <Link to="/" className="back-link">← Back to Dojo</Link>
                    <h1>Pattern Dojo</h1>
                    <p className="subtitle">Build muscle memory for CAT Quant structures</p>
                </div>

                {state === 'start' && (
                    <div className="start-container">
                        <div className="config-card">
                            <h2>Prepare Your Training</h2>

                            <div className="config-section">
                                <label>Focus Area</label>
                                <div className="selector-grid">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`selector-btn ${config.category === cat.id ? 'active' : ''}`}
                                            onClick={() => setConfig(prev => ({ ...prev, category: cat.id }))}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="config-section">
                                <label>Intensity</label>
                                <div className="selector-grid">
                                    {DIFFICULTIES.map(diff => (
                                        <button
                                            key={diff.id}
                                            className={`selector-btn ${config.difficulty === diff.id ? 'active' : ''}`}
                                            onClick={() => setConfig(prev => ({ ...prev, difficulty: diff.id }))}
                                        >
                                            {diff.name} <span>({diff.time}s)</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="start-btn" onClick={prepareSession}>
                                Enter Dojo
                            </button>
                        </div>

                        <div className="training-info">
                            <div className="info-item">
                                <span className="icon">⚡</span>
                                <div>
                                    <h3>Pattern Flash</h3>
                                    <p>Identify the question structure in SECONDS. No pen, no paper.</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="icon">🎯</span>
                                <div>
                                    <h3>Trigger Training</h3>
                                    <p>Spot "trigger words" that reveal the hidden math architecture.</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="icon">🧠</span>
                                <div>
                                    <h3>Variant Reinforcement</h3>
                                    <p>Recognize the same pattern under different surface stories.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {state === 'playing' && currentPattern && (
                    <div className="game-stage flash-stage animate-in">
                        <div className="game-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${((idx + 1) / sessionPatterns.length) * 100}%` }}></div>
                            </div>
                            <div className="stats">
                                <span>{idx + 1} / {sessionPatterns.length}</span>
                                <span>Score: {score}</span>
                            </div>
                        </div>

                        <div className={`timer-display ${timer <= 2 ? 'urgent' : ''} ${answer !== null ? 'frozen' : ''}`}>
                            {timer}
                        </div>

                        <div className="pattern-stem-card">
                            <p>{currentPattern.stem}</p>
                            {currentPattern.catFrequency && (
                                <div className={`frequency-badge ${currentPattern.catFrequency}`}>
                                    {currentPattern.catFrequency.toUpperCase()} FREQUENCY
                                </div>
                            )}
                        </div>

                        <div className="pattern-options">
                            {currentPattern.shuffledOptions.map(opt => {
                                const isUserAnswer = answer === opt;
                                const isCorrect = opt === currentPattern.name;
                                let statusClass = '';

                                if (answer !== null) {
                                    if (isUserAnswer) statusClass = isCorrect ? 'user-correct' : 'user-wrong';
                                    else if (isCorrect) statusClass = 'reveal-correct';
                                }

                                return (
                                    <button
                                        key={opt}
                                        className={`pattern-option ${statusClass}`}
                                        onClick={() => handleAnswer(opt)}
                                        disabled={answer !== null}
                                    >
                                        {opt}
                                        {statusClass === 'user-correct' && <span className="feedback-icon pulse">✓</span>}
                                        {statusClass === 'user-wrong' && <span className="feedback-icon shake">×</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {state === 'pyq' && (
                    <div className="game-stage pyq-stage animate-in">
                        <div className="feedback-header">
                            {answer === currentPattern.name ? (
                                <div className="result correct">
                                    <span className="icon">✓</span>
                                    <div>
                                        <h3>Spot On!</h3>
                                        <p>That is indeed a {currentPattern.name} structure.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="result wrong">
                                    <span className="icon">×</span>
                                    <div>
                                        <h3>Not quite...</h3>
                                        <p>This was a <strong>{currentPattern.name}</strong> pattern.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pyq-comparison">
                            <div className="comparison-card">
                                <h4>Real CAT Application</h4>
                                <div className="pyq-meta">
                                    <span>CAT {matchingPyq?.year || 'N/A'}</span>
                                    <span>Slot {matchingPyq?.slot || 'N/A'}</span>
                                </div>
                                <div className="pyq-text">
                                    <p>{matchingPyq?.question || "No matching question found."}</p>
                                </div>
                                <button className="reveal-btn" onClick={() => setState('solution')}>
                                    Extract Pattern Insight
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {state === 'solution' && currentPattern && (
                    <div className="game-stage solution-stage animate-in">
                        <div className="solution-content-card">
                            <div className="result-mini">
                                <span className={`mini-badge ${answer === currentPattern.name ? 'correct' : 'wrong'}`}>
                                    {answer === currentPattern.name ? '✓ Flash Success' : '× Flash Missed'}
                                </span>
                                <span className="pattern-name-label">PATTERN: <strong>{currentPattern.name}</strong></span>
                            </div>

                            <div className="comparison-layout">
                                <div className="panels-grid">
                                    <div className="signature-panel">
                                        <h4><span>🔍</span> Pattern Signature</h4>
                                        <div className="stem-text">
                                            {highlightTriggers(currentPattern.stem, currentPattern.triggers)}
                                        </div>
                                        <div className="section-label">TRIGGER WORDS</div>
                                        <div className="trigger-list">
                                            {currentPattern.triggers?.map(t => (
                                                <span key={t} className="trigger-tag">{t}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="application-panel">
                                        <h4><span>🎯</span> Application</h4>
                                        <div className="pyq-text-small">
                                            {highlightTriggers(matchingPyq?.question, currentPattern.triggers)}
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                                            Notice how the same triggers appear in the real exam problem.
                                        </p>
                                    </div>
                                </div>

                                <div className="approach-section">
                                    <div className="approach-card">
                                        <div className="approach-grid">
                                            <div className="approach-main">
                                                <h5>THE APPROACH</h5>
                                                <div className="approach-text">{currentPattern.insight?.approach || currentPattern.mentalShortcut}</div>
                                                <div className="formula-display">
                                                    <code>{currentPattern.insight?.formula || currentPattern.mentalShortcut}</code>
                                                </div>
                                            </div>
                                            <div className="approach-side">
                                                <h5>QUICK TIPS</h5>
                                                <div className="trap-callout">
                                                    <span>Avoid the Trap</span>
                                                    {currentPattern.insight?.trap || currentPattern.trapAnswer}
                                                </div>
                                                <div className="memory-callout">
                                                    <span>Memory Hook</span>
                                                    {currentPattern.insight?.memory || currentPattern.mentalShortcut}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="solution-collapsible">
                                    <button
                                        className="collapsible-trigger"
                                        onClick={() => setShowSolution(!showSolution)}
                                    >
                                        {showSolution ? 'Hide Full Solution ▲' : 'Show Full Step-By-Step Solution ▼'}
                                    </button>
                                    {showSolution && (
                                        <div className="explanation-section animate-in">
                                            {renderSolutionSteps(matchingPyq?.solution)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="next-btn" onClick={() => setState('variant')}>
                                Reinforce Pattern →
                            </button>
                        </div>
                    </div>
                )}

                {state === 'variant' && currentPattern && (
                    <div className="game-stage variant-stage animate-in">
                        <div className="variant-header">
                            <span className="badge">PRACTICE REINFORCEMENT</span>
                            <h2>Same Architecture, New Story</h2>
                            <p>Identify if this story uses the same <strong>{currentPattern.name}</strong> pattern.</p>
                        </div>

                        <div className="variant-card">
                            <div className="variant-question">
                                "{currentPattern.activeVariant?.text || currentPattern.activeVariant}"
                            </div>

                            {variantResult === null ? (
                                <div className="variant-solve-section">
                                    {currentPattern.activeVariant?.format === 'TITA' ? (
                                        <div className="variant-tita-input">
                                            <input
                                                type="number"
                                                placeholder="Enter numeric answer"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleVariantGuess(e.target.value == currentPattern.activeVariant.answer);
                                                }}
                                            />
                                            <button className="solve-btn" onClick={(e) => handleVariantGuess(e.target.previousSibling.value == currentPattern.activeVariant.answer)}>Submit</button>
                                        </div>
                                    ) : currentPattern.activeVariant?.options ? (
                                        <div className="variant-mcq-options">
                                            {currentPattern.activeVariant.options.map(opt => (
                                                <button
                                                    key={opt}
                                                    className="selector-btn"
                                                    onClick={() => handleVariantGuess(opt === currentPattern.activeVariant.answer)}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="variant-actions">
                                            <button className="selector-btn active" onClick={() => handleVariantGuess(true)}>
                                                Is the same pattern
                                            </button>
                                            <button className="selector-btn" onClick={() => handleVariantGuess(false)}>
                                                Is a different pattern
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`result ${variantResult === 'correct' ? 'correct' : 'wrong'}`}>
                                    {variantResult === 'correct' ? (
                                        <><span>✓</span> Correct! You recognized the architecture.</>
                                    ) : (
                                        <><span>×</span> Actually, it IS the same pattern. Look for the triggers.</>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {state === 'done' && (
                    <div className="done-container animate-in">
                        <div className="results-card">
                            <div className="trophy">🏆</div>
                            <h2>Session Complete!</h2>
                            <div className="score-summary">
                                <div className="score-circle">
                                    <span className="big-score">{score}</span>
                                    <span className="total">/ {sessionPatterns.length}</span>
                                </div>
                                <p>Patterns mastered in this session</p>
                            </div>

                            <div className="performance-analysis">
                                <div className="analysis-card">
                                    <h3>Speed Analysis</h3>
                                    {history.map((h, i) => (
                                        <div key={i} className="speed-metric">
                                            <span className="metric-label">{h.patternName}</span>
                                            <span className={`speed-tag ${h.responseTime < 3 ? 'fast' : 'slow'}`}>
                                                {h.responseTime}s {h.responseTime < 3 ? '⚡ Fast' : '🐢 Slow'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="analysis-card">
                                    <h3>Focus Areas</h3>
                                    <div className="weak-list">
                                        {history.filter(h => !h.correct).length > 0 ? (
                                            history.filter(h => !h.correct).map((h, i) => (
                                                <div key={i} className="weak-item">
                                                    <span className="icon">×</span>
                                                    <span>{h.patternName} ({h.category})</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="weak-item" style={{ color: '#166534' }}>
                                                <span className="icon" style={{ color: '#166534' }}>✓</span>
                                                All patterns recognized instantly!
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                        Target response time: &lt; 3 seconds for Ninja mastery.
                                    </div>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="retry-btn" onClick={() => setState('start')}>
                                    Start New Session
                                </button>
                                <Link to="/" className="home-link">Return to Dashboard</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
