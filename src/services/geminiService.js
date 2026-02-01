/**
 * Notes Quiz Service - AI-First Question Generation
 * 
 * FLOW:
 * 1. Analyze notes with AI (OpenRouter) to understand concepts
 * 2. Generate original CAT 2026 questions with AI (PRIMARY)
 * 3. If AI fails, fall back to PYQ database matching (FALLBACK)
 */

import { extractText } from './ocrService.js';
import { analyzeNotesConcepts, hasApiKey } from './conceptAnalyzer.js';
import { generateAIQuestions } from './aiQuestionGenerator.js';
import { findMatchingPYQs, findMatchingPYQsByConcept } from './pyqMatchingService.js';

export { hasApiKey };

// Legacy export
export const hasGeminiKey = hasApiKey;

// Timer durations based on question count (in seconds)
const getTimerDuration = (count) => {
    const durations = { 5: 600, 10: 1200, 20: 2400 }; // 10min, 20min, 40min
    return durations[count] || 600;
};

/**
 * Main function: Generate quiz from notes
 * @param {File[]} files - Uploaded images/PDFs
 * @param {Object} config - Quiz configuration (count, difficulty)
 * @param {string} manualNotesText - Text entered manually
 */
export const generateQuiz = async (files, config, manualNotesText = null) => {
    const { difficulty, questionCount } = config;

    // STEP 0: Content check
    if ((!files || files.length === 0) && !manualNotesText?.trim()) {
        throw new Error('Please upload notes or type your notes content');
    }

    // STEP 1: Try AI-powered generation (PRIMARY)
    if (hasApiKey()) {
        try {
            console.log('🚀 Using AI-First Question Generation...');
            return await generateQuizWithAI(files, config, manualNotesText);
        } catch (aiError) {
            console.warn('AI generation failed, falling back to PYQ database:', aiError.message);
            // Fall through to PYQ matching
        }
    }

    // STEP 2: Fallback to OCR + PYQ matching
    console.log('📚 Using PYQ Database Fallback...');
    return await generateQuizWithPYQs(files, config, manualNotesText);
};

/**
 * PRIMARY: Generate quiz using AI (concept analysis + AI question generation)
 */
const generateQuizWithAI = async (files, config, manualNotesText) => {
    const { difficulty, questionCount } = config;

    // Step 1: Analyze notes to understand concepts
    console.log('🧠 Step 1: Analyzing notes with AI...');
    const conceptAnalysis = await analyzeNotesConcepts(files, manualNotesText || '');

    if (!conceptAnalysis.success && conceptAnalysis.fallback) {
        console.warn('Concept analysis used fallback, trying AI generation anyway...');
    }

    console.log('✅ Concepts identified:', conceptAnalysis.mainConcepts);

    // Step 2: Generate questions with AI
    console.log('🎯 Step 2: Generating CAT 2026 questions with AI...');

    try {
        const questions = await generateAIQuestions(conceptAnalysis, {
            questionCount,
            difficulty: conceptAnalysis.difficultyRecommendation || difficulty
        });

        console.log(`✅ Generated ${questions.length} AI questions`);
        return questions;

    } catch (genError) {
        console.warn('AI question generation failed:', genError.message);

        // Try PYQ matching with the concept analysis we have
        console.log('⚡ Falling back to concept-matched PYQs...');
        return await generateQuizFromPYQsWithConcepts(conceptAnalysis, config);
    }
};

/**
 * FALLBACK: Generate quiz from PYQs using concept analysis
 */
const generateQuizFromPYQsWithConcepts = async (conceptAnalysis, config) => {
    const { questionCount, difficulty } = config;

    const result = findMatchingPYQsByConcept(conceptAnalysis, {
        ...config,
        difficulty: conceptAnalysis.difficultyRecommendation || difficulty
    });

    return formatPYQQuestions(result.questions, false);
};

/**
 * FALLBACK: Generate quiz using OCR + keyword matching (no AI)
 */
const generateQuizWithPYQs = async (files, config, manualNotesText) => {
    let extractedText = manualNotesText || '';

    // OCR Extraction for images
    if (files && files.length > 0) {
        console.log('📖 Extracting text from notes using OCR...');
        try {
            const ocrResult = await extractText(files);
            extractedText = [extractedText, ocrResult.text].filter(t => t.trim()).join('\n\n');
            console.log(`✅ OCR successful via ${ocrResult.source}`);
        } catch (error) {
            console.error('OCR failed:', error.message);
            if (!manualNotesText?.trim()) {
                throw new Error('Could not read notes. Please try a clearer image or type your notes manually.');
            }
        }
    }

    if (!extractedText.trim()) {
        throw new Error('No text extracted. Please upload clearer notes or type your notes manually.');
    }

    // Keyword-based matching
    console.log('🔍 Finding relevant CAT PYQ questions...');
    const result = findMatchingPYQs(extractedText, config);

    return formatPYQQuestions(result.questions, true);
};

/**
 * Format PYQ questions for quiz UI
 */
const formatPYQQuestions = (questions, isKeywordFallback) => {
    return questions.map((q, index) => {
        let options = [];
        let answer = q.answer;

        if (q.options && q.options.length > 0) {
            options = q.options.map((opt, i) => {
                const label = String.fromCharCode(65 + i);
                if (opt.startsWith(`${label}. `)) return opt;
                return `${label}. ${opt}`;
            });

            const answerIndex = q.options.findIndex(opt =>
                opt === q.answer ||
                `${String.fromCharCode(65 + q.options.indexOf(opt))}. ${opt}` === q.answer
            );
            if (answerIndex !== -1) {
                answer = String.fromCharCode(65 + answerIndex);
            }
        }

        return {
            id: index + 1,
            type: options.length > 0 ? 'MCQ' : 'TITA',
            question: q.question,
            options: options,
            answer: answer,
            solution: formatPYQSolution(q, isKeywordFallback),
            topic: q.category,
            year: q.year,
            difficulty: q.difficulty,
            relevanceScore: q.relevanceScore,
            isAIGenerated: false,
            originalId: q.id
        };
    });
};

/**
 * Format PYQ solution for display
 */
const formatPYQSolution = (q, isKeywordFallback) => {
    let solution = `📝 **Topic:** ${q.category}`;
    if (q.subTopics && q.subTopics.length > 0) {
        solution += ` → ${q.subTopics.join(', ')}`;
    }

    solution += `\n📅 **Source:** CAT ${q.year}`;
    if (q.slot) solution += ` Slot ${q.slot}`;

    solution += `\n💪 **Difficulty:** ${(q.difficulty || 'medium').toUpperCase()}`;

    if (isKeywordFallback) {
        solution += `\n⚠️ **Note:** Matched using keywords (AI unavailable)`;
    }

    if (q.hint) {
        solution += `\n\n💡 **Hint:** ${q.hint}`;
    }

    solution += `\n\n✅ **Solution:**\n${q.solution || 'Detailed solution not available'}`;

    return solution;
};

/**
 * Get analysis summary without generating quiz
 */
export const analyzeNotesOnly = async (files, manualNotesText = null) => {
    if (hasApiKey()) {
        return await analyzeNotesConcepts(files, manualNotesText || '');
    }

    // Fallback
    let extractedText = manualNotesText || '';
    if (files && files.length > 0) {
        try {
            const ocrResult = await extractText(files);
            extractedText = [extractedText, ocrResult.text].filter(t => t.trim()).join('\n\n');
        } catch (e) { }
    }

    const { identifyTopics } = await import('./topicIdentifier.js');
    const analysis = identifyTopics(extractedText);

    return {
        extractedFormulas: analysis.detectedFormulas,
        concepts: analysis.detectedKeywords,
        topics: analysis.primaryTopics.map(t => t.displayName),
        summary: extractedText.slice(0, 200) + '...',
        isPremium: false
    };
};

export default {
    hasApiKey,
    generateQuiz,
    analyzeNotesOnly
};
