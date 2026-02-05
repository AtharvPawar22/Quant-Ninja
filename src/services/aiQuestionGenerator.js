/**
 * AI Question Generator Service
 * 
 * Generates CAT 2026 level Quant questions DIRECTLY from notes analysis.
 * Uses OpenRouter with best free models for math reasoning.
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Best FREE models for question generation (from OpenRouter)
const QUESTION_GEN_MODELS = [
    'google/gemma-3-27b-it:free',                    // Best: 2.95B tokens, 131K context, strong math
    'mistralai/mistral-small-3.1-24b-instruct:free', // 189M tokens, 128K context, great reasoning
    'nvidia/nemotron-nano-12b-2-vl:free',            // 694M tokens, 128K context, document intelligence
];

/**
 * Generate CAT-level questions based on concept analysis
 * @param {Object} conceptAnalysis - Result from conceptAnalyzer
 * @param {Object} config - Quiz configuration (count, difficulty)
 * @returns {Array} Array of generated questions
 */
export const generateAIQuestions = async (conceptAnalysis, config) => {
    const { questionCount = 5, difficulty = 'medium' } = config;

    if (!OPENROUTER_API_KEY) {
        throw new Error('API key not available');
    }

    const prompt = buildQuestionGenerationPrompt(conceptAnalysis, questionCount, difficulty);

    // Try each model until one works
    let lastError = null;
    for (const model of QUESTION_GEN_MODELS) {
        try {
            console.log(`🎯 Generating questions with ${model}...`);

            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'QuantNinja AI Quiz'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert CAT 2026 Quantitative Aptitude question setter. 
Your questions are used by IIM aspirants for practice.

CRITICAL RULES:
- Questions MUST directly test the concepts from the student's notes
- Questions must be RELEVANT - if notes are about AP/GP, don't ask percentage questions
- Questions must be SOLVABLE using formulas/concepts from the notes
- Always return ONLY valid JSON, no markdown, no explanations outside JSON`
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.4, // Lower temp for more focused output
                    max_tokens: 6000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.warn(`Model ${model} failed:`, errorData.error?.message);
                lastError = errorData.error?.message;
                continue;
            }

            const data = await response.json();
            const textResponse = data.choices?.[0]?.message?.content;

            if (!textResponse) {
                lastError = 'Empty response';
                continue;
            }

            // Parse the JSON response
            const cleanedResponse = textResponse
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            const result = JSON.parse(cleanedResponse);
            const questions = result.questions || result;

            if (!Array.isArray(questions) || questions.length === 0) {
                lastError = 'Invalid response format';
                continue;
            }

            console.log(`✅ Generated ${questions.length} AI questions with ${model}`);

            // Format questions for the quiz UI
            return formatGeneratedQuestions(questions, conceptAnalysis);

        } catch (error) {
            console.warn(`Model ${model} error:`, error.message);
            lastError = error.message;
            continue;
        }
    }

    throw new Error(`Question generation failed: ${lastError}`);
};

/**
 * Build the question generation prompt - FOCUSED ON RELEVANCE
 */
const buildQuestionGenerationPrompt = (analysis, count, difficulty) => {
    const topics = analysis.catTopics?.map(t => `${t.category}/${t.subTopic} (${Math.round((t.confidence || 0.8) * 100)}% match)`).join('\n  - ') || 'General Quant';
    const concepts = analysis.mainConcepts?.join(', ') || 'Mathematical concepts';
    const formulas = analysis.formulasDetected?.map(f => `${f.formula} (${f.purpose || 'formula'})`).join('\n  - ') || 'None detected';
    const notAbout = analysis.notAbout?.join(', ') || '';
    const questionAngles = analysis.questionAngles?.join(', ') || '';

    const difficultyGuide = {
        easy: '1-2 step problems, direct formula application',
        medium: '2-3 step problems, requires understanding',
        hard: '3-4 step problems, multiple concepts, needs shortcuts',
        mixture: '2 easy, 2 medium, 1 hard (for 5 questions)'
    };

    return `TASK: Generate ${count} CAT 2026 Quant questions DIRECTLY BASED ON these specific notes.

═══════════════════════════════════════════════════════════════
STUDENT'S NOTES ANALYSIS:
═══════════════════════════════════════════════════════════════

MAIN CONCEPTS LEARNED:
${concepts}

CAT TOPICS IDENTIFIED:
  - ${topics}

FORMULAS IN NOTES:
  - ${formulas}

SUGGESTED QUESTION TYPES: ${questionAngles || 'Standard applications'}

${notAbout ? `⛔ AVOID THESE TOPICS (not what notes are about): ${notAbout}` : ''}

DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
${difficultyGuide[difficulty] || difficultyGuide.medium}

═══════════════════════════════════════════════════════════════
STRICT REQUIREMENTS:
═══════════════════════════════════════════════════════════════

1. RELEVANCE IS CRITICAL:
   - Every question MUST test concepts from the notes above
   - If notes are about "Sum of AP", ask AP sum questions, NOT unrelated topics
   - A student should be able to solve these using ONLY what's in their notes

2. CAT 2026 AUTHENTICITY:
   - Match real CAT question patterns
   - Include both MCQ (4 options) and TITA types
   - Numbers should be workable (avoid ugly calculations)
   - One correct answer only

3. QUESTION QUALITY:
   - Clear, unambiguous language
   - Complete information provided
   - Realistic scenarios

4. SOLUTIONS MUST:
   - Be step-by-step
   - Reference the relevant formula from notes
   - Show CAT-style shortcuts where applicable

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (return ONLY this JSON, nothing else):
═══════════════════════════════════════════════════════════════

{
  "questions": [
    {
      "type": "MCQ",
      "question": "Full question text here...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "A",
      "difficulty": "medium",
      "topic": "${analysis.catTopics?.[0]?.category || 'QUANT'}",
      "subTopic": "${analysis.catTopics?.[0]?.subTopic || 'general'}",
      "conceptTested": "Which concept from notes this tests",
      "hint": "Brief hint",
      "solution": "Step 1: ...\\nStep 2: ...\\nShortcut: ...",
      "timeEstimate": 90
    }
  ]
}

Generate exactly ${count} questions now:`;
};

/**
 * Format generated questions for quiz UI
 */
const formatGeneratedQuestions = (questions, analysis) => {
    return questions.map((q, index) => {
        // Format options with labels
        let options = [];
        let answer = q.answer;

        if (q.type === 'MCQ' && q.options && q.options.length > 0) {
            options = q.options.map((opt, i) => {
                const label = String.fromCharCode(65 + i);
                if (opt.startsWith(`${label}.`) || opt.startsWith(`${label})`)) {
                    return opt;
                }
                return `${label}. ${opt}`;
            });
        }

        return {
            id: index + 1,
            type: q.type || (q.options?.length > 0 ? 'MCQ' : 'TITA'),
            question: q.question,
            options: options,
            answer: answer,
            solution: formatSolution(q, analysis),
            topic: q.topic || analysis.catTopics?.[0]?.category || 'QUANT',
            subTopic: q.subTopic,
            difficulty: q.difficulty || 'medium',
            year: 'AI-2026', // Mark as AI-generated
            hint: q.hint,
            conceptTested: q.conceptTested,
            timeEstimate: q.timeEstimate || 90,
            isAIGenerated: true,
            originalId: `ai-${index + 1}`
        };
    });
};

/**
 * Format solution for display
 */
const formatSolution = (q, analysis) => {
    let solution = `📝 **Topic:** ${q.topic || 'Quant'}`;
    if (q.subTopic) solution += ` → ${q.subTopic}`;

    solution += `\n🤖 **Source:** AI-Generated for CAT 2026`;
    solution += `\n💪 **Difficulty:** ${(q.difficulty || 'medium').toUpperCase()}`;
    solution += `\n⏱️ **Target Time:** ${q.timeEstimate || 90} seconds`;

    if (q.conceptTested) {
        solution += `\n\n📚 **Concept Tested:** ${q.conceptTested}`;
    }

    if (q.hint) {
        solution += `\n\n💡 **Hint:** ${q.hint}`;
    }

    solution += `\n\n✅ **Solution:**\n${q.solution || 'Solution not available'}`;

    return solution;
};

export default {
    generateAIQuestions
};
