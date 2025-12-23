// Notes Quiz Service - API-FREE version
// Uses OCR.space + Tesseract.js for text extraction
// Uses pure keyword matching against 259 CAT PYQ questions (no AI needed)

import { extractText } from './ocrService.js';
import { findMatchingPYQs, extractKeywordsFromNotes, getRandomPYQsFromCategory } from './pyqMatchingService.js';

// Check if we have OCR capability (always true since Tesseract is client-side)
export const hasApiKey = () => true;

// Extract concepts from text using pure keyword matching (no AI)
const extractConceptsFromText = (text) => {
    if (!text || !text.trim()) {
        return {
            extractedFormulas: [],
            concepts: [],
            topics: ['general'],
            examples: [],
            summary: ''
        };
    }

    const keywords = extractKeywordsFromNotes(text);

    // Extract potential formulas (simple pattern matching)
    const formulaPatterns = [
        /[a-zA-Z]\s*[=]\s*[^,\n]+/g, // a = something
        /\([^)]+\)\s*[=]\s*[^,\n]+/g, // (expression) = something
        /\d+\s*[+\-*/]\s*\d+\s*[=]\s*\d+/g, // arithmetic
        /√[^=\s]+/g, // square roots
        /\w+²|\w+³/g, // squares and cubes
    ];

    const extractedFormulas = [];
    for (const pattern of formulaPatterns) {
        const matches = text.match(pattern) || [];
        extractedFormulas.push(...matches.slice(0, 5)); // Limit to 5 per pattern
    }

    return {
        extractedFormulas: [...new Set(extractedFormulas)].slice(0, 15),
        concepts: keywords.matchedKeywords.slice(0, 20),
        topics: keywords.categories.length > 0 ? keywords.categories : ['general'],
        examples: [],
        summary: text.slice(0, 300)
    };
};

// Main function: Generate quiz using OCR + keyword matching (NO AI API)
export const generateQuiz = async (files, config, manualNotesText = null) => {
    const { difficulty, questionCount } = config;

    // Check if we have any content to process
    if ((!files || files.length === 0) && !manualNotesText?.trim()) {
        throw new Error('Please upload notes or type your notes content');
    }

    let extractedText = manualNotesText || '';

    // STEP 1: Extract text from files using OCR (no AI needed)
    if (files && files.length > 0) {
        console.log('📖 Step 1: Extracting text from notes using OCR...');
        try {
            const ocrResult = await extractText(files);
            extractedText = [extractedText, ocrResult.text].filter(t => t.trim()).join('\n\n');
            console.log(`✅ OCR completed via ${ocrResult.source} (confidence: ${Math.round(ocrResult.confidence * 100)}%)`);
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

    // STEP 2: Extract concepts using pure keyword matching (no AI)
    console.log('🔍 Step 2: Analyzing notes content...');
    const extractedContent = extractConceptsFromText(extractedText);
    console.log('📚 Detected topics:', extractedContent.topics);
    console.log('📝 Found concepts:', extractedContent.concepts.slice(0, 10));

    // STEP 3: Match against 259 CAT PYQ questions (pure keyword matching)
    console.log('🎯 Step 3: Finding matching CAT PYQ questions from 259-question bank...');
    const pyqResult = findMatchingPYQs(extractedText, extractedContent, questionCount, difficulty);

    console.log(`✅ Found ${pyqResult.matchedQuestions.length} relevant PYQ questions`);

    // If we don't have enough matches, we'll still return what we have
    // No AI fallback - just use the best matches we found
    let allQuestions = pyqResult.matchedQuestions;

    // If we still need more questions, get random ones from matching categories
    if (allQuestions.length < questionCount && extractedContent.topics.length > 0) {
        console.log(`📋 Adding ${questionCount - allQuestions.length} more questions from matched categories...`);

        for (const category of extractedContent.topics) {
            if (allQuestions.length >= questionCount) break;

            const categoryMap = {
                'profitLoss': 'ARITHMETIC',
                'percentage': 'ARITHMETIC',
                'ratio': 'ARITHMETIC',
                'timeWork': 'ARITHMETIC',
                'timeDistance': 'ARITHMETIC',
                'average': 'ARITHMETIC',
                'interest': 'ARITHMETIC',
                'ages': 'ARITHMETIC',
                'equations': 'ALGEBRA',
                'functions': 'ALGEBRA',
                'inequalities': 'ALGEBRA',
                'logarithms': 'ALGEBRA',
                'sequences': 'PROGRESSIONS',
                'maxMin': 'ALGEBRA',
                'triangles': 'GEOMETRY',
                'circles': 'GEOMETRY',
                'quadrilaterals': 'GEOMETRY',
                'polygons': 'GEOMETRY',
                'coordinate': 'GEOMETRY',
                'area': 'GEOMETRY',
                'divisibility': 'NUMBER_SYSTEM',
                'remainder': 'NUMBER_SYSTEM',
                'primes': 'NUMBER_SYSTEM',
                'digits': 'NUMBER_SYSTEM',
                'numberTypes': 'NUMBER_SYSTEM',
                'ap': 'PROGRESSIONS',
                'gp': 'PROGRESSIONS',
                'hp': 'PROGRESSIONS',
                'specialSequences': 'PROGRESSIONS',
            };

            const pyqCategory = categoryMap[category] || category;
            const additionalQuestions = getRandomPYQsFromCategory(pyqCategory, questionCount - allQuestions.length);

            // Format and add (avoiding duplicates)
            const existingIds = new Set(allQuestions.map(q => q.originalId));
            for (const q of additionalQuestions) {
                if (!existingIds.has(q.id) && allQuestions.length < questionCount) {
                    allQuestions.push({
                        id: allQuestions.length + 1,
                        type: q.options[0] === 'numerical' ? 'TITA' : 'MCQ',
                        question: q.question,
                        options: q.options[0] === 'numerical' ? [] : q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`),
                        answer: q.options[0] === 'numerical' ? q.answer :
                            q.options.findIndex(opt => opt === q.answer) >= 0
                                ? String.fromCharCode(65 + q.options.findIndex(opt => opt === q.answer))
                                : q.answer,
                        solution: `💡 Hint: ${q.hint}\n\n📝 Solution: ${q.solution}`,
                        topic: q.category,
                        difficulty: 'medium',
                        isPYQ: true,
                        originalId: q.id
                    });
                    existingIds.add(q.id);
                }
            }
        }
    }

    // Log summary
    console.log(`📊 Final quiz: ${allQuestions.length} CAT PYQ questions (100% real CAT questions!)`);

    if (allQuestions.length === 0) {
        throw new Error('Could not find matching questions. Please try notes with clearer mathematical content.');
    }

    return allQuestions;
};

// Export extracted content for UI display (optional)
export const extractNotesContent = async (files, manualNotesText = null) => {
    let extractedText = manualNotesText || '';

    if (files && files.length > 0) {
        const ocrResult = await extractText(files);
        extractedText = [extractedText, ocrResult.text].filter(t => t.trim()).join('\n\n');
    }

    return extractConceptsFromText(extractedText);
};

export default {
    hasApiKey,
    generateQuiz,
    extractNotesContent
};
