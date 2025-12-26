/**
 * Enhanced PYQ Matching Service for CAT Quant
 * 
 * Scoring Factors:
 * 1. Category Match (High)
 * 2. SubTopic Match (High)
 * 3. Keyword Overlap (Medium)
 * 4. Formula Relevance (Medium)
 * 5. Difficulty Alignment (Low)
 * 6. Diversity (Ensures no repetition of same sub-topic)
 */

import { questions as ALL_QUESTIONS } from '../data/cat-pyq.js';
import { identifyTopics } from './topicIdentifier.js';

export const findMatchingPYQs = (notesText, config) => {
    const { questionCount = 5, difficulty = 'mixture' } = config;

    // 1. Analyze the notes
    const topicAnalysis = identifyTopics(notesText);

    // 2. Score all questions back in the bank
    const scoredQuestions = ALL_QUESTIONS.map(q => {
        const score = calculateRelevanceScore(q, topicAnalysis, difficulty);
        return { ...q, relevanceScore: score };
    });

    // 3. Filter and Sort
    const qualified = scoredQuestions
        .filter(q => q.relevanceScore > 5) // Minimum threshold
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // 4. Apply Diversity and Selection
    const selected = applyDiversityAndSelect(qualified, questionCount);

    // 5. Fallback if not enough questions
    let finalQuestions = selected;
    if (finalQuestions.length < questionCount) {
        const remainingMain = questionCount - finalQuestions.length;
        const fallback = ALL_QUESTIONS
            .filter(q => !finalQuestions.find(fq => fq.id === q.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, remainingMain);
        finalQuestions = [...finalQuestions, ...fallback];
    }

    return {
        questions: finalQuestions,
        analysis: topicAnalysis
    };
};

const calculateRelevanceScore = (question, analysis, targetDifficulty) => {
    let score = 0;

    // Factor 1: Category Match (40 pts)
    const primaryCategories = analysis.primaryTopics.map(t => t.category);
    if (primaryCategories.includes(question.category)) {
        score += 40;
    } else if (analysis.secondaryTopics.map(t => t.category).includes(question.category)) {
        score += 20;
    }

    // Factor 2: SubTopic Match (30 pts)
    const primarySubTopics = analysis.primaryTopics.map(t => t.subTopic);
    const overlappingSubTopics = (question.subTopics || []).filter(st => primarySubTopics.includes(st));
    score += overlappingSubTopics.length * 15;

    // Factor 3: Keyword Overlap (15 pts)
    const overlappingKeywords = (question.keywords || []).filter(kw =>
        analysis.detectedKeywords.includes(kw.toLowerCase())
    );
    score += Math.min(overlappingKeywords.length * 3, 15);

    // Factor 4: Formula Relevance (10 pts)
    // Implicitly handled by keywords and subtopics in our taxonomy, but we can boost
    if (analysis.detectedFormulas && analysis.detectedFormulas.length > 0) {
        // If question category matches formula-rich intent
        if (score > 40) score += 10;
    }

    // Factor 5: Difficulty Alignment (5 pts)
    if (targetDifficulty === 'mixture' || question.difficulty === targetDifficulty) {
        score += 5;
    }

    return score;
};

const applyDiversityAndSelect = (questions, count) => {
    const selected = [];
    const usedSubTopics = new Set();

    // First pass: try to get unique subtopics
    for (const q of questions) {
        if (selected.length >= count) break;

        const qSubTopic = q.subTopics?.[0];
        if (!qSubTopic || !usedSubTopics.has(qSubTopic)) {
            selected.push(q);
            if (qSubTopic) usedSubTopics.add(qSubTopic);
        }
    }

    // Second pass: fill remaining if needed
    if (selected.length < count) {
        for (const q of questions) {
            if (selected.length >= count) break;
            if (!selected.find(sq => sq.id === q.id)) {
                selected.push(q);
            }
        }
    }

    return selected;
};
