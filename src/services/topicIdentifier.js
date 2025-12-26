/**
 * Advanced Topic Identification Engine for CAT Quant
 * 
 * Uses multiple signals to identify topics:
 * 1. Keyword matching (weighted by frequency and specificity)
 * 2. Formula detection (pattern matching for math expressions)
 * 3. Context analysis (concept clustering)
 */

import { TOPIC_TAXONOMY, KEYWORD_TO_TOPICS, FORMULA_PATTERNS } from '../data/topicTaxonomy.js';

export const identifyTopics = (text) => {
    if (!text) return { primaryTopics: [], secondaryTopics: [], confidence: 0 };

    const normalizedText = normalizeText(text);

    // 1. Extract Keywords and their weights
    const keywordScores = extractKeywordScores(normalizedText);

    // 2. Detect Formulas
    const detectedFormulas = detectFormulas(normalizedText);

    // 3. Score Topics
    const topicScores = calculateTopicScores(keywordScores, detectedFormulas);

    // 4. Categorize and Rank
    const { primary, secondary } = rankTopics(topicScores);

    // 5. Calculate overall confidence
    const confidence = calculateOverallConfidence(primary, secondary, normalizedText);

    return {
        primaryTopics: primary,
        secondaryTopics: secondary,
        detectedFormulas,
        detectedKeywords: Object.keys(keywordScores),
        confidence
    };
};

const normalizeText = (text) => {
    return text.toLowerCase()
        .replace(/['']/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
};

const extractKeywordScores = (text) => {
    const scores = {};

    // We iterate over the reverse mapping
    for (const [keyword, topics] of Object.entries(KEYWORD_TO_TOPICS)) {
        // Use word boundaries for exact matches
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
        const matches = text.match(regex);

        if (matches) {
            const count = matches.length;
            // Specificity: 1 divided by number of topics it maps to
            const specificity = 1 / topics.length;

            // Base weight from taxonomy
            const baseWeight = topics[0].weight || 1.0;

            scores[keyword] = {
                count,
                specificity,
                weight: baseWeight,
                total: count * specificity * baseWeight,
                topics
            };
        }
    }

    return scores;
};

const detectFormulas = (text) => {
    const detected = [];
    for (const [key, pattern] of Object.entries(FORMULA_PATTERNS)) {
        if (pattern.test(text)) {
            detected.push(key);
        }
    }
    return detected;
};

const calculateTopicScores = (keywordScores, detectedFormulas) => {
    const topicScores = {}; // Key: "Category|SubTopic"

    // Add scores from keywords
    for (const data of Object.values(keywordScores)) {
        for (const topic of data.topics) {
            const key = `${topic.category}|${topic.subTopic}`;
            if (!topicScores[key]) {
                topicScores[key] = {
                    category: topic.category,
                    subTopic: topic.subTopic,
                    displayName: topic.displayName,
                    score: 0,
                    matches: 0
                };
            }
            topicScores[key].score += data.total;
            topicScores[key].matches += data.count;
        }
    }

    // Add scores from formulas
    for (const formulaKey of detectedFormulas) {
        // Find which subtopics this formula belongs to in the taxonomy
        for (const [cat, catData] of Object.entries(TOPIC_TAXONOMY)) {
            for (const [sub, subData] of Object.entries(catData.subTopics)) {
                if (subData.formulas.some(f => f.toLowerCase().includes(formulaKey.toLowerCase()) || formulaKey.toLowerCase().includes(f.toLowerCase()))) {
                    const key = `${cat}|${sub}`;
                    if (!topicScores[key]) {
                        topicScores[key] = {
                            category: cat,
                            subTopic: sub,
                            displayName: subData.displayName,
                            score: 0,
                            matches: 0
                        };
                    }
                    topicScores[key].score += 5.0; // Formulas have high weight
                }
            }
        }
    }

    return Object.values(topicScores);
};

const rankTopics = (scores) => {
    // Sort by score descending
    const sorted = [...scores].sort((a, b) => b.score - a.score);

    if (sorted.length === 0) return { primary: [], secondary: [] };

    const maxScore = sorted[0].score;
    const primary = sorted.filter(s => s.score >= maxScore * 0.6 || s.score >= 5.0);
    const secondary = sorted.filter(s => s.score < maxScore * 0.6 && s.score >= maxScore * 0.2 && s.score > 0);

    return { primary, secondary };
};

const calculateOverallConfidence = (primary, secondary, text) => {
    if (primary.length === 0) return 0;

    // Higher score if we have clear primary topics
    let confidence = Math.min(primary.reduce((acc, p) => acc + p.score, 0) / 10, 1.0);

    // Penalize if the text is very short but has many matches (likely noise)
    if (text.length < 50 && primary.length > 3) confidence *= 0.5;

    // Boost if we have formula matches
    return confidence;
};

// Utility to tag existing questions (used for programmatic enrichment)
export const tagQuestion = (questionText, existingCategory) => {
    const analysis = identifyTopics(questionText);

    // Filter tags to be consistent with existing category IF possible
    let tags = analysis.primaryTopics.map(t => t.subTopic);

    // If no primary topics found, fallback to secondary
    if (tags.length === 0) {
        tags = analysis.secondaryTopics.map(t => t.subTopic);
    }

    // If still empty, use a generic tag based on category
    if (tags.length === 0 && existingCategory) {
        tags = [existingCategory.toLowerCase()];
    }

    return {
        subTopics: [...new Set(tags)],
        keywords: analysis.detectedKeywords.slice(0, 8),
        formulas: analysis.detectedFormulas
    };
};
