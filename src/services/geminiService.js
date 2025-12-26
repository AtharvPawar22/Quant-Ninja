/**
 * Notes Quiz Service - Intelligent PYQ Matcher
 * 
 * Flow: 
 * 1. OCR Extraction (OCR.space + Tesseract)
 * 2. Topic Identification (Keywords + Formulas + Context)
 * 3. Relevant PYQ Selection (Multi-factor scoring)
 */

import { extractText } from './ocrService.js';
import { findMatchingPYQs as matchQuestions } from './pyqMatchingService.js';
import { identifyTopics } from './topicIdentifier.js';

export const hasApiKey = () => true;

/**
 * Main function: Generate quiz using OCR + Intelligent Topic Identification
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

    let extractedText = manualNotesText || '';

    // STEP 1: OCR Extraction
    if (files && files.length > 0) {
        console.log('📖 Step 1: Extracting text from notes using OCR...');
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

    // STEP 2: Topic Identification & Matching
    console.log('🔍 Step 2: Finding most relevant CAT PYQ questions...');
    const result = matchQuestions(extractedText, config);

    // STEP 3: Format questions for the UI components
    const formattedQuestions = result.questions.map((q, index) => {
        // Handle options formatting
        let options = [];
        let answer = q.answer;

        if (q.options && q.options.length > 0) {
            // Check if options are already formatted or need labels
            options = q.options.map((opt, i) => {
                const label = String.fromCharCode(65 + i);
                if (opt.startsWith(`${label}. `)) return opt;
                return `${label}. ${opt}`;
            });

            // Ensure answer is a label (A, B, C, D) if it matches an option text
            const answerIndex = q.options.findIndex(opt => opt === q.answer || `${String.fromCharCode(65 + q.options.indexOf(opt))}. ${opt}` === q.answer);
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
            solution: `📝 **Topic:** ${q.category} (${q.subTopics?.join(', ') || 'General'})\n📅 **Source:** CAT ${q.year} Slot ${q.slot}\n💪 **Difficulty:** ${q.difficulty.toUpperCase()}\n\n💡 **Hint:** ${q.hint}\n\n✅ **Solution:**\n${q.solution}`,
            topic: q.category,
            year: q.year,
            difficulty: q.difficulty,
            relevanceScore: q.relevanceScore,
            originalId: q.id
        };
    });

    console.log(`✅ Generated quiz with ${formattedQuestions.length} relevant CAT questions`);

    return formattedQuestions;
};

/**
 * Quick analysis of notes without generating full quiz
 */
export const extractNotesContent = async (files, manualNotesText = null) => {
    let extractedText = manualNotesText || '';

    if (files && files.length > 0) {
        try {
            const ocrResult = await extractText(files);
            extractedText = [extractedText, ocrResult.text].filter(t => t.trim()).join('\n\n');
        } catch (e) { }
    }

    const analysis = identifyTopics(extractedText);

    return {
        extractedFormulas: analysis.detectedFormulas,
        concepts: analysis.detectedKeywords,
        topics: analysis.primaryTopics.map(t => t.displayName),
        summary: extractedText.slice(0, 200) + '...'
    };
};

export default {
    hasApiKey,
    generateQuiz,
    extractNotesContent
};
