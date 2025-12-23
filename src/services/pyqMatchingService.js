// PYQ Matching Service for Notes Quiz
// Matches notes content against the 259 CAT PYQ questions

import { questions as CAT_PYQ_QUESTIONS } from '../data/cat-pyq.js';

// Concept keywords mapped to PYQ categories and specific topics
const CONCEPT_KEYWORDS = {
    ARITHMETIC: {
        profitLoss: ['profit', 'loss', 'cost price', 'selling price', 'discount', 'markup', 'margin', 'cp', 'sp', 'marked price', 'mp'],
        percentage: ['percentage', 'percent', '%', 'increase', 'decrease', 'hike', 'reduction'],
        ratio: ['ratio', 'proportion', 'mix', 'mixture', 'alligation', 'blend', 'combine'],
        timeWork: ['work', 'days', 'efficiency', 'pipe', 'fill', 'empty', 'tank', 'job', 'complete'],
        timeDistance: ['speed', 'distance', 'time', 'km', 'hr', 'train', 'car', 'boat', 'stream', 'upstream', 'downstream', 'relative speed', 'meet'],
        average: ['average', 'mean', 'median', 'mode', 'weighted average'],
        interest: ['interest', 'simple interest', 'compound interest', 'si', 'ci', 'principal', 'rate', 'annuity'],
        ages: ['age', 'years', 'older', 'younger', 'born'],
    },
    ALGEBRA: {
        equations: ['equation', 'quadratic', 'linear', 'roots', 'polynomial', 'solve', 'variable', 'coefficient'],
        functions: ['function', 'f(x)', 'domain', 'range', 'composite', 'inverse'],
        inequalities: ['inequality', 'greater', 'less', 'modulus', 'absolute', '|x|'],
        logarithms: ['log', 'logarithm', 'ln', 'natural log', 'exponent', 'power', 'base'],
        sequences: ['sequence', 'series', 'ap', 'gp', 'arithmetic progression', 'geometric progression', 'sum of n terms', 'nth term'],
        maxMin: ['maximum', 'minimum', 'max', 'min', 'optimize', 'greatest', 'least'],
    },
    GEOMETRY: {
        triangles: ['triangle', 'equilateral', 'isosceles', 'right angle', 'hypotenuse', 'altitude', 'median', 'centroid', 'orthocenter', 'incircle', 'circumcircle'],
        circles: ['circle', 'radius', 'diameter', 'chord', 'tangent', 'sector', 'segment', 'arc', 'concentric'],
        quadrilaterals: ['rectangle', 'square', 'parallelogram', 'rhombus', 'trapezium', 'trapezoid', 'quadrilateral'],
        polygons: ['polygon', 'hexagon', 'octagon', 'pentagon', 'regular polygon', 'interior angle', 'exterior angle', 'diagonal'],
        coordinate: ['coordinate', 'x-axis', 'y-axis', 'slope', 'intercept', 'midpoint', 'distance formula', 'section formula'],
        area: ['area', 'perimeter', 'surface area', 'volume', 'mensuration'],
    },
    NUMBER_SYSTEM: {
        divisibility: ['divisibility', 'divisible', 'factor', 'multiple', 'hcf', 'lcm', 'gcd', 'prime factor'],
        remainder: ['remainder', 'modulo', 'mod', 'remainder theorem', 'cyclic'],
        primes: ['prime', 'composite', 'co-prime', 'twin prime', 'factorial'],
        digits: ['digit', 'unit digit', 'tens digit', 'place value', 'sum of digits', 'palindrome'],
        numberTypes: ['natural', 'integer', 'whole', 'rational', 'irrational', 'real', 'even', 'odd'],
    },
    PROGRESSIONS: {
        ap: ['arithmetic progression', 'ap', 'common difference', 'arithmetic mean', 'first term', 'last term'],
        gp: ['geometric progression', 'gp', 'common ratio', 'geometric mean', 'infinite gp'],
        hp: ['harmonic progression', 'hp', 'harmonic mean'],
        specialSequences: ['fibonacci', 'triangular number', 'square number', 'sum of squares', 'sum of cubes'],
    }
};

// Extract keywords from notes text
export const extractKeywordsFromNotes = (notesText) => {
    const lowerText = notesText.toLowerCase();
    const foundKeywords = {
        categories: new Set(),
        topics: new Set(),
        matchedKeywords: []
    };

    for (const [category, topics] of Object.entries(CONCEPT_KEYWORDS)) {
        for (const [topic, keywords] of Object.entries(topics)) {
            for (const keyword of keywords) {
                if (lowerText.includes(keyword.toLowerCase())) {
                    foundKeywords.categories.add(category);
                    foundKeywords.topics.add(topic);
                    foundKeywords.matchedKeywords.push(keyword);
                }
            }
        }
    }

    return {
        categories: Array.from(foundKeywords.categories),
        topics: Array.from(foundKeywords.topics),
        matchedKeywords: foundKeywords.matchedKeywords
    };
};

// Score a PYQ question based on how well it matches the notes content
const scorePYQRelevance = (pyq, notesKeywords, notesText) => {
    let score = 0;
    const lowerNotesText = notesText.toLowerCase();
    const lowerQuestion = pyq.question.toLowerCase();
    const lowerHint = (pyq.hint || '').toLowerCase();
    const lowerSolution = (pyq.solution || '').toLowerCase();

    // Category match (high weight)
    if (notesKeywords.categories.includes(pyq.category)) {
        score += 30;
    }

    // Direct keyword matches in question text
    for (const keyword of notesKeywords.matchedKeywords) {
        if (lowerQuestion.includes(keyword.toLowerCase())) {
            score += 10;
        }
        if (lowerHint.includes(keyword.toLowerCase())) {
            score += 5;
        }
        if (lowerSolution.includes(keyword.toLowerCase())) {
            score += 3;
        }
    }

    // Check for formula/concept overlap
    const formulaPatterns = [
        /\d+\s*[+\-*/]\s*\d+/g, // Basic arithmetic
        /\w+\s*[²³]/g, // Powers
        /√/g, // Square roots
        /log/gi, // Logarithms
        /ratio/gi,
        /percentage/gi,
    ];

    for (const pattern of formulaPatterns) {
        const notesMatches = lowerNotesText.match(pattern) || [];
        const questionMatches = lowerQuestion.match(pattern) || [];
        if (notesMatches.length > 0 && questionMatches.length > 0) {
            score += 5;
        }
    }

    // Penalize if category doesn't match at all
    if (notesKeywords.categories.length > 0 && !notesKeywords.categories.includes(pyq.category)) {
        score -= 10;
    }

    return Math.max(0, score);
};

// Find matching PYQ questions for given notes content
export const findMatchingPYQs = (notesText, extractedConcepts, requestedCount, difficulty = 'mixture') => {
    // Combine notes text with extracted concepts for keyword matching
    let combinedText = notesText || '';
    if (extractedConcepts) {
        combinedText += ' ' + (extractedConcepts.extractedFormulas || []).join(' ');
        combinedText += ' ' + (extractedConcepts.concepts || []).join(' ');
        combinedText += ' ' + (extractedConcepts.summary || '');
    }

    if (!combinedText.trim()) {
        return { matchedQuestions: [], unmatchedTopics: [], matchScore: 0 };
    }

    // Extract keywords from combined text
    const keywords = extractKeywordsFromNotes(combinedText);

    console.log('🔍 PYQ Matching - Detected categories:', keywords.categories);
    console.log('🔍 PYQ Matching - Detected topics:', keywords.topics);
    console.log('🔍 PYQ Matching - Keywords found:', keywords.matchedKeywords.slice(0, 10));

    // Score all PYQ questions
    const scoredQuestions = CAT_PYQ_QUESTIONS.map(pyq => ({
        ...pyq,
        relevanceScore: scorePYQRelevance(pyq, keywords, combinedText)
    }));

    // Filter by difficulty if specified
    let filteredQuestions = scoredQuestions;
    if (difficulty !== 'mixture') {
        // Map difficulty to typical PYQ categories (since PYQs don't have explicit difficulty)
        // We'll use score distribution instead
    }

    // Sort by relevance score (highest first)
    filteredQuestions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Get top matching questions
    const matchThreshold = 15; // Minimum score to be considered a match
    const matchedQuestions = filteredQuestions
        .filter(q => q.relevanceScore >= matchThreshold)
        .slice(0, requestedCount);

    // Format questions for quiz display
    const formattedQuestions = matchedQuestions.map((q, index) => ({
        id: index + 1,
        type: q.options[0] === 'numerical' ? 'TITA' : 'MCQ',
        question: q.question,
        options: q.options[0] === 'numerical' ? [] : q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`),
        answer: q.options[0] === 'numerical' ? q.answer : q.options.findIndex(opt => opt === q.answer) >= 0
            ? String.fromCharCode(65 + q.options.findIndex(opt => opt === q.answer))
            : q.answer,
        solution: `💡 Hint: ${q.hint}\n\n📝 Solution: ${q.solution}`,
        topic: q.category,
        difficulty: q.relevanceScore > 40 ? 'hard' : q.relevanceScore > 25 ? 'medium' : 'easy',
        isPYQ: true, // Mark as actual CAT PYQ
        originalId: q.id,
        matchScore: q.relevanceScore
    }));

    // Determine unmatched topics for AI generation
    const matchedCategories = new Set(matchedQuestions.map(q => q.category));
    const unmatchedTopics = keywords.topics.filter(topic => {
        // Check if any matched question covers this topic
        return matchedQuestions.length < requestedCount;
    });

    const avgMatchScore = matchedQuestions.length > 0
        ? matchedQuestions.reduce((sum, q) => sum + q.relevanceScore, 0) / matchedQuestions.length
        : 0;

    console.log(`✅ PYQ Matching - Found ${formattedQuestions.length} relevant questions (avg score: ${avgMatchScore.toFixed(1)})`);

    return {
        matchedQuestions: formattedQuestions,
        unmatchedTopics: keywords.categories.length > 0 ? keywords.categories : ['general'],
        matchScore: avgMatchScore,
        remainingCount: Math.max(0, requestedCount - formattedQuestions.length)
    };
};

// Get random PYQs from a category (fallback)
export const getRandomPYQsFromCategory = (category, count) => {
    const categoryQuestions = CAT_PYQ_QUESTIONS.filter(q => q.category === category);
    const shuffled = categoryQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Get PYQ categories summary
export const getPYQCategoriesSummary = () => {
    const summary = {};
    for (const q of CAT_PYQ_QUESTIONS) {
        summary[q.category] = (summary[q.category] || 0) + 1;
    }
    return summary;
};

export default {
    findMatchingPYQs,
    getRandomPYQsFromCategory,
    getPYQCategoriesSummary,
    extractKeywordsFromNotes
};
