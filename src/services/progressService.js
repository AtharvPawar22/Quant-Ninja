/**
 * Progress Service for Quant Ninja
 * Handles localStorage persistence for question attempts and bookmarks.
 */

const STORAGE_KEY = 'quant_ninja_progress';

export const getProgress = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return {
            attempted: {}, // { qId: { isCorrect: boolean, timeSpent: number, date: string } }
            bookmarked: [], // [qId]
            lastActive: new Date().toISOString()
        };
    }
    return JSON.parse(saved);
};

export const saveProgress = (progress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const markQuestionAttempted = (qId, isCorrect, timeSpent = 0) => {
    const progress = getProgress();
    progress.attempted[qId] = {
        isCorrect,
        timeSpent,
        date: new Date().toISOString()
    };
    progress.lastActive = new Date().toISOString();
    saveProgress(progress);
};

export const toggleBookmark = (qId) => {
    const progress = getProgress();
    const index = progress.bookmarked.indexOf(qId);
    if (index === -1) {
        progress.bookmarked.push(qId);
    } else {
        progress.bookmarked.splice(index, 1);
    }
    saveProgress(progress);
    return progress.bookmarked.includes(qId);
};

export const isBookmarked = (qId) => {
    const progress = getProgress();
    return progress.bookmarked.includes(qId);
};

export const getStats = (allQuestions = []) => {
    const progress = getProgress();
    const attemptedIds = Object.keys(progress.attempted);
    const correctCount = attemptedIds.filter(id => progress.attempted[id].isCorrect).length;

    // Topic-wise stats
    const topicStats = {};
    allQuestions.forEach(q => {
        if (!topicStats[q.topic]) {
            topicStats[q.topic] = { total: 0, attempted: 0, correct: 0 };
        }
        topicStats[q.topic].total++;
        if (progress.attempted[q.id]) {
            topicStats[q.topic].attempted++;
            if (progress.attempted[q.id].isCorrect) {
                topicStats[q.topic].correct++;
            }
        }
    });

    return {
        totalAttempted: attemptedIds.length,
        correctCount,
        accuracy: attemptedIds.length > 0 ? (correctCount / attemptedIds.length) * 100 : 0,
        topicStats
    };
};

export const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
};
