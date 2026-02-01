/**
 * Enhanced PYQ Matching Service for CAT Quant
 * 
 * TWO MODES:
 * 1. CONCEPT-BASED (Premium): Uses Gemini's concept analysis for intelligent matching
 * 2. KEYWORD-BASED (Fallback): Uses traditional keyword overlap
 * 
 * Scoring Factors for Concept Mode:
 * 1. Direct topic match (highest weight)
 * 2. SubTopic alignment
 * 3. "notAbout" exclusion (critical for avoiding false matches)
 * 4. Question angle relevance
 * 5. Difficulty alignment
 */

import { questions as ALL_QUESTIONS } from '../data/cat-pyq.js';
import { identifyTopics } from './topicIdentifier.js';

/**
 * PREMIUM: Find matching PYQs using Gemini's concept analysis
 */
export const findMatchingPYQsByConcept = (conceptAnalysis, config) => {
    const { questionCount = 5, difficulty = 'mixture' } = config;
    const { catTopics, notAbout, questionAngles, formulasDetected } = conceptAnalysis;

    console.log('🎯 Concept-based matching with:', {
        topics: catTopics?.map(t => `${t.category}/${t.subTopic}`),
        avoiding: notAbout,
        angles: questionAngles
    });

    // Step 1: Filter out "notAbout" topics first (CRITICAL)
    let candidates = ALL_QUESTIONS.filter(q => {
        // Check if this question matches any "notAbout" topic
        if (notAbout && notAbout.length > 0) {
            for (const avoid of notAbout) {
                const avoidLower = avoid.toLowerCase();
                // Check category name
                if (q.category?.toLowerCase().includes(avoidLower)) return false;
                // Check subtopics
                if (q.subTopics?.some(st => st.toLowerCase().includes(avoidLower))) return false;
                // Check question text for obvious mismatches
                if (avoidLower.includes('average') &&
                    q.category === 'ARITHMETIC' &&
                    q.subTopics?.includes('averages')) return false;
            }
        }
        return true;
    });

    console.log(`📊 After notAbout filter: ${candidates.length} candidates (from ${ALL_QUESTIONS.length})`);

    // Step 2: Score all remaining questions
    const scoredQuestions = candidates.map(q => {
        const score = calculateConceptScore(q, conceptAnalysis, difficulty);
        return { ...q, relevanceScore: score };
    });

    // Step 3: Filter and Sort
    const qualified = scoredQuestions
        .filter(q => q.relevanceScore > 20) // Higher threshold for concept matching
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log(`✅ Qualified questions: ${qualified.length}`);

    // Step 4: Apply Diversity and Selection
    const selected = applyDiversityAndSelect(qualified, questionCount);

    // Step 5: Fallback if not enough questions
    let finalQuestions = selected;
    if (finalQuestions.length < questionCount) {
        const remaining = questionCount - finalQuestions.length;
        console.log(`⚠️ Need ${remaining} more questions, using secondary matches`);

        const fallback = scoredQuestions
            .filter(q => q.relevanceScore > 5 && !finalQuestions.find(fq => fq.id === q.id))
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, remaining);

        finalQuestions = [...finalQuestions, ...fallback];
    }

    return {
        questions: finalQuestions,
        analysis: conceptAnalysis,
        matchingMode: 'concept'
    };
};

/**
 * Calculate relevance score based on concept analysis
 */
const calculateConceptScore = (question, analysis, targetDifficulty) => {
    let score = 0;
    const { catTopics, questionAngles, formulasDetected } = analysis;

    // Factor 1: Direct Category Match (50 pts max)
    for (const topic of catTopics || []) {
        if (question.category === topic.category) {
            score += 30 * (topic.confidence || 0.8);

            // Bonus for subtopic match
            if (question.subTopics?.includes(topic.subTopic)) {
                score += 20 * (topic.confidence || 0.8);
            }
        }
    }

    // Factor 2: Question Angle Match (20 pts max)
    if (questionAngles && questionAngles.length > 0) {
        const questionText = question.question.toLowerCase();
        for (const angle of questionAngles) {
            const angleLower = angle.toLowerCase();
            // Check if question matches the suggested angle
            if (questionText.includes(angleLower.split(' ')[0])) {
                score += 10;
                break;
            }
        }
    }

    // Factor 3: Formula Relevance (15 pts max)
    if (formulasDetected && formulasDetected.length > 0) {
        for (const formula of formulasDetected) {
            // Check if question likely uses similar formula
            const questionText = question.question.toLowerCase();
            const solutionText = question.solution?.toLowerCase() || '';

            if (formula.purpose &&
                (questionText.includes(formula.purpose.split(' ')[0].toLowerCase()) ||
                    solutionText.includes(formula.formula?.toLowerCase() || ''))) {
                score += 15;
                break;
            }
        }
    }

    // Factor 4: Difficulty Alignment (10 pts)
    if (targetDifficulty === 'mixture') {
        score += 10; // All difficulties welcome
    } else if (question.difficulty === targetDifficulty) {
        score += 10;
    } else if (
        (targetDifficulty === 'medium' && question.difficulty === 'easy') ||
        (targetDifficulty === 'medium' && question.difficulty === 'hard')
    ) {
        score += 5; // Adjacent difficulty
    }

    // Factor 5: Recency Bonus (5 pts for 2024+)
    if (question.year >= 2024) {
        score += 5;
    } else if (question.year >= 2023) {
        score += 3;
    }

    return score;
};

/**
 * FALLBACK: Original keyword-based matching
 */
export const findMatchingPYQs = (notesText, config) => {
    const { questionCount = 5, difficulty = 'mixture' } = config;

    // 1. Analyze the notes using keywords
    const topicAnalysis = identifyTopics(notesText);

    // 2. Score all questions
    const scoredQuestions = ALL_QUESTIONS.map(q => {
        const score = calculateKeywordScore(q, topicAnalysis, difficulty);
        return { ...q, relevanceScore: score };
    });

    // 3. Filter and Sort
    const qualified = scoredQuestions
        .filter(q => q.relevanceScore > 5)
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
        analysis: topicAnalysis,
        matchingMode: 'keyword'
    };
};

/**
 * Original keyword-based scoring
 */
const calculateKeywordScore = (question, analysis, targetDifficulty) => {
    let score = 0;

    // Category Match (40 pts)
    const primaryCategories = analysis.primaryTopics.map(t => t.category);
    if (primaryCategories.includes(question.category)) {
        score += 40;
    } else if (analysis.secondaryTopics.map(t => t.category).includes(question.category)) {
        score += 20;
    }

    // SubTopic Match (30 pts)
    const primarySubTopics = analysis.primaryTopics.map(t => t.subTopic);
    const overlappingSubTopics = (question.subTopics || []).filter(st => primarySubTopics.includes(st));
    score += overlappingSubTopics.length * 15;

    // Keyword Overlap (15 pts)
    const overlappingKeywords = (question.keywords || []).filter(kw =>
        analysis.detectedKeywords.includes(kw.toLowerCase())
    );
    score += Math.min(overlappingKeywords.length * 3, 15);

    // Formula Relevance (10 pts)
    if (analysis.detectedFormulas && analysis.detectedFormulas.length > 0) {
        if (score > 40) score += 10;
    }

    // Difficulty Alignment (5 pts)
    if (targetDifficulty === 'mixture' || question.difficulty === targetDifficulty) {
        score += 5;
    }

    return score;
};

/**
 * Ensure diversity in selected questions
 */
const applyDiversityAndSelect = (questions, count) => {
    const selected = [];
    const usedSubTopics = new Set();
    const usedCategories = new Map(); // Track count per category

    // First pass: prioritize unique subtopics and spread categories
    for (const q of questions) {
        if (selected.length >= count) break;

        const qSubTopic = q.subTopics?.[0];
        const categoryCount = usedCategories.get(q.category) || 0;

        // Prefer questions with new subtopics and don't over-represent one category
        if ((!qSubTopic || !usedSubTopics.has(qSubTopic)) && categoryCount < Math.ceil(count / 2)) {
            selected.push(q);
            if (qSubTopic) usedSubTopics.add(qSubTopic);
            usedCategories.set(q.category, categoryCount + 1);
        }
    }

    // Second pass: fill remaining with highest scores
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

export default {
    findMatchingPYQs,
    findMatchingPYQsByConcept
};
