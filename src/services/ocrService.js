// Hybrid OCR Service - API-FREE (No Gemini needed)
// Primary: OCR.space (25k free/month) | Fallback: Tesseract.js (unlimited, client-side)

import Tesseract from 'tesseract.js';

const OCR_SPACE_API_KEY = import.meta.env.VITE_OCR_SPACE_API_KEY || 'K87899142388957'; // Free tier key
const OCR_SPACE_ENDPOINT = 'https://api.ocr.space/parse/image';

// File to base64 conversion
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Post-process OCR text to improve math notation recognition
 */
const postProcessMathText = (text) => {
    if (!text) return text;

    let processed = text;

    // Common OCR misreadings for mathematical symbols
    const replacements = [
        // Powers and exponents
        [/(\w)\s*\^\s*2\b/g, '$1²'],
        [/(\w)\s*\^\s*3\b/g, '$1³'],
        [/\bsquare\s*root\b/gi, '√'],

        // Square root - common OCR misreads
        [/V(\d)/gi, '√$1'],
        [/sqrt\s*\(/gi, '√('],

        // Common math symbols cleanup
        [/(\d)\s*\/\s*(\d)/g, '$1/$2'], // Clean up fractions
        [/\(\s+/g, '('], // Remove spaces after (
        [/\s+\)/g, ')'], // Remove spaces before )

        // Pi and other constants
        [/\bpi\b/gi, 'π'],
        [/\btheta\b/gi, 'θ'],
        [/\balpha\b/gi, 'α'],
        [/\bbeta\b/gi, 'β'],
        [/\bgamma\b/gi, 'γ'],

        // Inequality symbols
        [/\b(<=|=<)\b/g, '≤'],
        [/\b(>=|=>)\b/g, '≥'],
        [/\b(!=|<>)\b/g, '≠'],

        // Common OCR digit errors
        [/\bl(\d)/g, '1$1'], // "l5" -> "15" (l misread as 1)
        [/O(\d)/g, '0$1'], // "O5" -> "05" (O misread as 0)

        // Clean up common math terms
        [/\bx\s*x\b/gi, 'x²'],
        [/\by\s*y\b/gi, 'y²'],
    ];

    for (const [pattern, replacement] of replacements) {
        processed = processed.replace(pattern, replacement);
    }

    // Clean up multiple spaces and newlines
    processed = processed.replace(/\s+/g, ' ');
    processed = processed.replace(/\n\s*\n/g, '\n');

    return processed.trim();
};

/**
 * OCR.space API - Primary OCR method
 * Free tier: 25,000 requests/month
 * Good for both printed and handwritten text
 */
const extractTextWithOCRSpace = async (file) => {
    try {
        console.log('📸 Using OCR.space for text extraction...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('apikey', OCR_SPACE_API_KEY);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        formData.append('OCREngine', '2'); // Engine 2 is better for handwriting
        formData.append('isTable', 'true'); // Better for structured math content

        const response = await fetch(OCR_SPACE_ENDPOINT, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.IsErroredOnProcessing) {
            throw new Error(data.ErrorMessage?.[0] || 'OCR.space processing error');
        }

        if (!data.ParsedResults || data.ParsedResults.length === 0) {
            throw new Error('No text detected by OCR.space');
        }

        let extractedText = data.ParsedResults[0].ParsedText;

        // Post-process for mathematical notation
        extractedText = postProcessMathText(extractedText);

        const confidence = data.ParsedResults[0].FileParseExitCode === 1 ? 0.9 : 0.7;

        console.log('✅ OCR.space extraction successful');
        return {
            text: extractedText,
            confidence,
            source: 'OCR.space'
        };
    } catch (error) {
        console.warn('⚠️ OCR.space failed:', error.message);
        throw error;
    }
};

/**
 * Tesseract.js - Fallback OCR method (client-side, unlimited)
 * Runs entirely in browser - no API calls needed
 */
const extractTextWithTesseract = async (file) => {
    try {
        console.log('🔄 Using Tesseract.js (client-side OCR)...');

        const { data } = await Tesseract.recognize(
            file,
            'eng',
            {
                logger: (info) => {
                    if (info.status === 'recognizing text') {
                        console.log(`OCR Progress: ${Math.round(info.progress * 100)}%`);
                    }
                }
            }
        );

        if (!data.text || data.text.trim().length < 5) {
            throw new Error('Tesseract extracted insufficient text');
        }

        // Post-process for math
        const processedText = postProcessMathText(data.text);

        console.log('✅ Tesseract.js extraction successful');
        return {
            text: processedText,
            confidence: data.confidence / 100, // Convert to 0-1 scale
            source: 'Tesseract.js'
        };
    } catch (error) {
        console.error('❌ Tesseract.js failed:', error.message);
        throw error;
    }
};

/**
 * Hybrid OCR - Try OCR.space first, then Tesseract.js
 * Both work without any AI API!
 * @param {File|File[]} files - Single file or array of files
 * @returns {Promise<{text: string, confidence: number, source: string}>}
 */
export const extractText = async (files) => {
    const fileArray = Array.isArray(files) ? files : [files];

    if (fileArray.length === 0) {
        throw new Error('No files provided for OCR');
    }

    const results = [];

    for (const file of fileArray) {
        let bestResult = null;

        // Try OCR.space first (fast, good accuracy)
        try {
            bestResult = await extractTextWithOCRSpace(file);
        } catch (ocrSpaceError) {
            console.log('OCR.space failed, trying Tesseract.js...');
        }

        // If OCR.space failed or has low confidence, try Tesseract
        if (!bestResult || bestResult.confidence < 0.6) {
            try {
                const tesseractResult = await extractTextWithTesseract(file);
                if (!bestResult || tesseractResult.confidence > bestResult.confidence) {
                    bestResult = tesseractResult;
                }
            } catch (tesseractError) {
                console.log('Tesseract.js also failed');
            }
        }

        // If both methods failed, throw error
        if (!bestResult || !bestResult.text?.trim()) {
            throw new Error(
                `Could not read ${file.name}. Please ensure the image is clear with visible text, or type your notes manually.`
            );
        }

        results.push(bestResult);
    }

    // Combine results from multiple files
    const combinedText = results.map(r => r.text).join('\n\n--- Next Page ---\n\n');
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    const sources = [...new Set(results.map(r => r.source))].join(' + ');

    return {
        text: combinedText,
        confidence: avgConfidence,
        source: sources,
        fileCount: fileArray.length
    };
};

/**
 * Validate OCR quality
 */
export const validateOCRQuality = (confidence) => {
    if (confidence < 0.4) {
        return {
            valid: false,
            message: 'Low OCR quality. Please upload a clearer image or type your notes manually.'
        };
    }

    if (confidence < 0.7) {
        return {
            valid: true,
            message: 'Moderate OCR quality. Some text may need verification.'
        };
    }

    return {
        valid: true,
        message: 'Good OCR quality. Text extracted successfully.'
    };
};

/**
 * Check if OCR service is available
 */
export const isOCRAvailable = () => {
    return true; // Always available - Tesseract.js runs client-side
};

export default {
    extractText,
    validateOCRQuality,
    isOCRAvailable
};
