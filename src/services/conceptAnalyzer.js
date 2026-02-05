/**
 * Concept Analyzer Service - The Brain of Premium Notes to Quiz
 * 
 * Uses OpenRouter API with FREE vision-capable models to understand what 
 * mathematical concepts notes are teaching, NOT just keyword matching.
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// FREE vision-capable models (from OpenRouter - all support images)
const FREE_VISION_MODELS = [
    'google/gemma-3-27b-it:free',                    // 2.95B tokens, 131K context, best reasoning
    'nvidia/nemotron-nano-12b-2-vl:free',            // 694M tokens, 128K context, document intelligence
    'mistralai/mistral-small-3.1-24b-instruct:free', // 189M tokens, 128K context, multimodal
    'allenai/molmo2-8b:free',                        // 650M tokens, 37K context, vision-language
    'qwen/qwen2.5-vl-7b-instruct:free',              // 68.2M tokens, 33K context, SoTA image understanding
];

// For text-only notes (reuse same models, they work for text too)
const FREE_TEXT_MODELS = [
    'google/gemma-3-27b-it:free',                    // Best reasoning, 131K context
    'mistralai/mistral-small-3.1-24b-instruct:free', // Strong text reasoning
    'nvidia/nemotron-nano-12b-2-vl:free',            // Good for documents
];
export const hasApiKey = () => {
    return !!OPENROUTER_API_KEY && OPENROUTER_API_KEY.trim().length > 0;
};

// Legacy export for backwards compatibility
export const hasGeminiKey = hasApiKey;

/**
 * Convert File to base64 data URL for vision API
 */
const fileToBase64DataUrl = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // Returns full data URL
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * The main concept analysis prompt - this is where the magic happens
 */
const CONCEPT_ANALYSIS_PROMPT = `You are a CAT 2026 Quantitative Aptitude expert analyzing a student's study notes.

Your task is to deeply understand what MATHEMATICAL CONCEPTS these notes are teaching - not just identify keywords.

CRITICAL RULES:
1. Do NOT match based on single words appearing in the notes
2. Understand the CONTEXT and PURPOSE of what's being taught
3. A note mentioning "arithmetic mean" in the context of AP/GP is about PROGRESSIONS, not AVERAGES
4. A note about "average speed" is about TIME-SPEED-DISTANCE, not AVERAGES
5. Consider the overall topic being studied, not isolated terms

Analyze and return ONLY valid JSON (no markdown, no explanation):

{
  "mainConcepts": ["string array of 2-5 main mathematical concepts being taught"],
  "catTopics": [
    {
      "category": "ARITHMETIC|ALGEBRA|NUMBER_SYSTEM|GEOMETRY|PROGRESSIONS",
      "subTopic": "the specific subtopic like 'equations', 'ap', 'triangles'",
      "confidence": 0.0 to 1.0,
      "reason": "brief reason why this topic matches"
    }
  ],
  "formulasDetected": [
    {
      "formula": "the formula as written",
      "standardForm": "standard mathematical notation",
      "purpose": "what this formula is used for",
      "catRelevance": "how this appears in CAT questions"
    }
  ],
  "learningStage": "beginner|intermediate|advanced",
  "questionAngles": ["what types of CAT questions would test this knowledge"],
  "notAbout": ["topics that might seem related due to keywords but are NOT what these notes teach"],
  "difficultyRecommendation": "easy|medium|hard|mixture",
  "confidenceScore": 0.0 to 1.0,
  "analysisNotes": "brief explanation of your understanding"
}

CAT TOPIC REFERENCE:
- ARITHMETIC: percentages, profitLoss, ratiosProportion, timeSpeed, timeWork, averages, interest, ages, clocks
- ALGEBRA: equations, functions, inequalities, logarithms, maxMin
- NUMBER_SYSTEM: divisibility, remainders, primes, digits, counting, probability
- GEOMETRY: triangles, circles, quadrilaterals, polygons, coordinate, mensuration
- PROGRESSIONS: ap, gp, specialSequences

Analyze the notes and provide your expert analysis:`;

/**
 * Analyze notes content using OpenRouter API with vision support
 * @param {File[]} imageFiles - Array of image/PDF files
 * @param {string} textContent - Manual text input
 * @returns {Object} Concept analysis result
 */
export const analyzeNotesConcepts = async (imageFiles = [], textContent = '') => {
    if (!hasApiKey()) {
        console.warn('OpenRouter API key not configured. Using fallback analysis.');
        return await getFallbackAnalysis(textContent);
    }

    try {
        // Build the message content array for OpenRouter (OpenAI format)
        const content = [];
        let hasImages = false;
        // Add text prompt
        content.push({
            type: 'text',
            text: CONCEPT_ANALYSIS_PROMPT
        });

        // Add any manual text content
        if (textContent && textContent.trim()) {
            content.push({
                type: 'text',
                text: `\n\nTEXT NOTES PROVIDED:\n${textContent}`
            });
        }

        // Add images (OpenRouter uses OpenAI vision format)
        for (const file of imageFiles) {
            if (file.type.startsWith('image/')) {
                const dataUrl = await fileToBase64DataUrl(file);
                content.push({
                    type: 'image_url',
                    image_url: {
                        url: dataUrl
                    }
                });
                hasImages = true;
            } else if (file.type === 'application/pdf') {
                // PDFs need OCR first - handled in geminiService.js
                console.log('PDF detected - will use OCR extraction');
            }
        }

        // Choose model list based on whether we have images
        const modelsToTry = hasImages ? FREE_VISION_MODELS : FREE_TEXT_MODELS;
        console.log(`📋 Using ${hasImages ? 'vision' : 'text-only'} models:`, modelsToTry[0]);

        // Try each model until one works
        let lastError = null;
        for (const model of modelsToTry) {
            try {
                console.log(`🤖 Trying model: ${model}`);

                const response = await fetch(OPENROUTER_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'QuantNinja Notes Quiz'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: 'user',
                                content: content
                            }
                        ],
                        temperature: 0.2,
                        max_tokens: 2048
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.warn(`Model ${model} failed:`, errorData.error?.message);
                    lastError = errorData.error?.message || `HTTP ${response.status}`;
                    continue; // Try next model
                }

                const data = await response.json();
                const textResponse = data.choices?.[0]?.message?.content;

                if (!textResponse) {
                    console.warn(`Model ${model} returned empty response`);
                    lastError = 'Empty response';
                    continue; // Try next model
                }

                // Parse the JSON response
                const cleanedResponse = textResponse
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();

                const analysis = JSON.parse(cleanedResponse);

                console.log(`✅ Concept analysis complete with ${model}:`, analysis.mainConcepts);
                return {
                    success: true,
                    ...analysis,
                    source: `openrouter-${model.split('/')[1].split(':')[0]}`
                };

            } catch (modelError) {
                console.warn(`Model ${model} error:`, modelError.message);
                lastError = modelError.message;
                continue; // Try next model
            }
        }

        // All models failed
        throw new Error(`All models failed. Last error: ${lastError}`);
    } catch (error) {
        console.error('Concept analysis failed:', error);
        return await getFallbackAnalysis(textContent, error.message);
    }
};

/**
 * Fallback analysis when API is unavailable
 * Uses the existing topicIdentifier for basic matching
 */
const getFallbackAnalysis = async (textContent = '', errorReason = '') => {
    try {
        // Dynamic import to avoid circular deps
        const { identifyTopics } = await import('./topicIdentifier.js');
        const basicAnalysis = identifyTopics(textContent);

        return {
            success: false,
            fallback: true,
            fallbackReason: errorReason || 'API not available',
            mainConcepts: basicAnalysis.primaryTopics?.map(t => t.displayName) || [],
            catTopics: basicAnalysis.primaryTopics?.map(t => ({
                category: t.category,
                subTopic: t.subTopic,
                confidence: 0.5,
                reason: 'Keyword-based fallback (less accurate)'
            })) || [],
            formulasDetected: basicAnalysis.detectedFormulas?.map(f => ({
                formula: f,
                purpose: 'Detected via pattern matching'
            })) || [],
            learningStage: 'intermediate',
            questionAngles: [],
            notAbout: [],
            difficultyRecommendation: 'mixture',
            confidenceScore: basicAnalysis.confidence || 0.3,
            analysisNotes: 'Using basic keyword matching due to API unavailability. Results may be less accurate.',
            source: 'fallback-keywords'
        };
    } catch (importError) {
        console.error('Fallback analysis import failed:', importError);
        return {
            success: false,
            fallback: true,
            fallbackReason: errorReason || 'Fallback analysis unavailable',
            mainConcepts: [],
            catTopics: [],
            formulasDetected: [],
            learningStage: 'intermediate',
            questionAngles: [],
            notAbout: [],
            difficultyRecommendation: 'mixture',
            confidenceScore: 0.1,
            analysisNotes: 'Could not perform concept analysis.',
            source: 'error-fallback'
        };
    }
};

/**
 * Quick check to see if content can be analyzed
 */
export const canAnalyze = (files = [], text = '') => {
    return (files && files.length > 0) || (text && text.trim().length > 10);
};

export default {
    analyzeNotesConcepts,
    hasApiKey,
    hasGeminiKey,
    canAnalyze
};
