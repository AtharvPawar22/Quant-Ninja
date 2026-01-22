// CAT Quant Topic Taxonomy with Hierarchical Keywords and Formulas
// Used for intelligent topic detection from notes

export const TOPIC_TAXONOMY = {
    ARITHMETIC: {
        displayName: 'Arithmetic',
        subTopics: {
            percentages: {
                displayName: 'Percentages',
                keywords: ['percentage', 'percent', '%', 'increase', 'decrease', 'hike', 'reduction', 'growth', 'rise', 'fall', 'increment', 'decrement'],
                formulas: ['successive-percentage', 'percentage-change', 'compound-growth', 'percentage-of'],
                weight: 1.0,
                analytics: { catWeight: 1.1, avgTimeBleed: 15, commonMistakeType: 'calculation' }
            },
            profitLoss: {
                displayName: 'Profit & Loss',
                keywords: ['profit', 'loss', 'cost price', 'selling price', 'discount', 'markup', 'margin', 'cp', 'sp', 'mp', 'marked price', 'gain', 'trader', 'merchant', 'shopkeeper', 'sold', 'bought'],
                formulas: ['profit-percentage', 'discount-formula', 'successive-discounts', 'markup-markdown'],
                weight: 1.2,
                analytics: { catWeight: 1.3, avgTimeBleed: 25, commonMistakeType: 'reading' }
            },
            ratiosProportion: {
                displayName: 'Ratios & Proportion',
                keywords: ['ratio', 'proportion', 'mix', 'mixture', 'alligation', 'blend', 'combine', 'parts', 'divide', 'share', 'distributed', 'fraction'],
                formulas: ['alligation-rule', 'mean-ratio', 'componendo-dividendo', 'ratio-comparison'],
                weight: 1.0,
                analytics: { catWeight: 1.2, avgTimeBleed: 20, commonMistakeType: 'concept' }
            },
            timeSpeed: {
                displayName: 'Time, Speed & Distance',
                keywords: ['speed', 'distance', 'time', 'km', 'hr', 'train', 'car', 'boat', 'stream', 'upstream', 'downstream', 'relative speed', 'meet', 'race', 'circular', 'track', 'travel', 'journey', 'km/h', 'km/hr', 'm/s', 'faster', 'slower'],
                formulas: ['relative-speed', 'boats-streams', 'circular-track', 'train-problems', 'distance=speed×time'],
                weight: 1.1,
                analytics: { catWeight: 1.4, avgTimeBleed: 40, commonMistakeType: 'calculation' }
            },
            timeWork: {
                displayName: 'Time & Work',
                keywords: ['work', 'days', 'efficiency', 'pipe', 'fill', 'empty', 'tank', 'job', 'complete', 'together', 'alone', 'cistern', 'inlet', 'outlet', 'finish'],
                formulas: ['work-rate', 'pipes-cistern', 'alternate-days', 'work=rate×time'],
                weight: 1.1,
                analytics: { catWeight: 1.3, avgTimeBleed: 35, commonMistakeType: 'concept' }
            },
            averages: {
                displayName: 'Averages',
                keywords: ['average', 'mean', 'median', 'mode', 'weighted average', 'sum', 'total', 'avg', 'arithmetic mean'],
                formulas: ['weighted-average', 'group-average', 'average=sum/count'],
                weight: 0.9,
                analytics: { catWeight: 0.8, avgTimeBleed: 10, commonMistakeType: 'calculation' }
            },
            interest: {
                displayName: 'Simple & Compound Interest',
                keywords: ['interest', 'simple interest', 'compound interest', 'si', 'ci', 'principal', 'rate', 'annuity', 'installment', 'compounded', 'annually', 'half-yearly', 'quarterly', 'amount', 'maturity'],
                formulas: ['si-formula', 'ci-formula', 'difference-si-ci', 'P×R×T/100'],
                weight: 1.0,
                analytics: { catWeight: 1.1, avgTimeBleed: 20, commonMistakeType: 'concept' }
            },
            ages: {
                displayName: 'Ages',
                keywords: ['age', 'years', 'older', 'younger', 'born', 'present age', 'future', 'past', 'years ago', 'years hence', 'father', 'son', 'mother', 'daughter'],
                formulas: ['age-ratio-change', 'age-difference-constant'],
                weight: 0.9,
                analytics: { catWeight: 0.7, avgTimeBleed: 10, commonMistakeType: 'reading' }
            },
            clocks: {
                displayName: 'Clocks & Calendars',
                keywords: ['clock', 'hour', 'minute', 'angle', 'hands', 'calendar', 'day', 'leap year', 'time', 'watch', 'seconds', 'overlap', 'coincide'],
                formulas: ['clock-angle', 'meeting-of-hands', 'relative-speed-clock'],
                weight: 0.8
            }
        }
    },
    ALGEBRA: {
        displayName: 'Algebra',
        subTopics: {
            equations: {
                displayName: 'Equations',
                keywords: ['equation', 'quadratic', 'linear', 'roots', 'polynomial', 'solve', 'variable', 'coefficient', 'discriminant', 'x²', 'ax²+bx+c', 'solutions', 'satisfy'],
                formulas: ['quadratic-formula', 'sum-of-roots', 'product-of-roots', 'vietas-formulas', '-b/a', 'c/a'],
                weight: 1.2,
                analytics: { catWeight: 1.5, avgTimeBleed: 30, commonMistakeType: 'calculation' }
            },
            functions: {
                displayName: 'Functions',
                keywords: ['function', 'f(x)', 'domain', 'range', 'composite', 'inverse', 'onto', 'one-one', 'bijective', 'injective', 'surjective', 'g(x)', 'fog', 'gof'],
                formulas: ['composite-function', 'inverse-function', 'f(g(x))'],
                weight: 1.1,
                analytics: { catWeight: 1.3, avgTimeBleed: 25, commonMistakeType: 'concept' }
            },
            inequalities: {
                displayName: 'Inequalities',
                keywords: ['inequality', 'greater', 'less', 'modulus', 'absolute', '|x|', 'range', 'interval', '≤', '≥', '<', '>', 'at least', 'at most', 'maximum', 'minimum'],
                formulas: ['modulus-properties', 'triangle-inequality', 'am-gm'],
                weight: 1.0
            },
            logarithms: {
                displayName: 'Logarithms & Exponents',
                keywords: ['log', 'logarithm', 'ln', 'natural log', 'exponent', 'power', 'base', 'antilog', 'log₁₀', 'log₂', 'logₓ', '10ˣ', '2ˣ', 'aˣ'],
                formulas: ['log-properties', 'change-of-base', 'exponential-equations', 'log(ab)=loga+logb'],
                weight: 1.1
            },
            maxMin: {
                displayName: 'Maxima & Minima',
                keywords: ['maximum', 'minimum', 'max', 'min', 'optimize', 'greatest', 'least', 'extreme', 'largest', 'smallest', 'highest', 'lowest'],
                formulas: ['am-gm', 'optimization-techniques', 'calculus-derivative'],
                weight: 1.0
            }
        }
    },
    NUMBER_SYSTEM: {
        displayName: 'Number System',
        subTopics: {
            divisibility: {
                displayName: 'Divisibility',
                keywords: ['divisibility', 'divisible', 'factor', 'multiple', 'hcf', 'lcm', 'gcd', 'prime factor', 'factorization', 'divides', 'common factor', 'common multiple'],
                formulas: ['divisibility-rules', 'hcf-lcm-product', 'hcf×lcm=product'],
                weight: 1.0,
                analytics: { catWeight: 1.3, avgTimeBleed: 20, commonMistakeType: 'calculation' }
            },
            remainders: {
                displayName: 'Remainders',
                keywords: ['remainder', 'modulo', 'mod', 'remainder theorem', 'cyclic', 'pattern', 'divided by', 'leaves remainder', 'cyclicity'],
                formulas: ['fermats-theorem', 'eulers-theorem', 'chinese-remainder', 'wilson-theorem'],
                weight: 1.1,
                analytics: { catWeight: 1.4, avgTimeBleed: 35, commonMistakeType: 'concept' }
            },
            primes: {
                displayName: 'Prime Numbers',
                keywords: ['prime', 'composite', 'co-prime', 'twin prime', 'factorial', 'prime factorization', 'prime number', 'factors'],
                formulas: ['number-of-factors', 'sum-of-factors', '(p+1)(q+1)...'],
                weight: 0.9
            },
            digits: {
                displayName: 'Digits & Place Value',
                keywords: ['digit', 'unit digit', 'tens digit', 'place value', 'sum of digits', 'palindrome', 'number formation', 'two-digit', 'three-digit', 'four-digit', 'last digit'],
                formulas: ['cyclicity', 'unit-digit-patterns', 'digit-sum'],
                weight: 0.9
            },
            counting: {
                displayName: 'Counting & P&C',
                keywords: ['permutation', 'combination', 'arrange', 'select', 'ways', 'factorial', 'nPr', 'nCr', 'counting', 'arrangements', 'selections', 'choose', 'how many'],
                formulas: ['permutation-formula', 'combination-formula', 'circular-arrangement', 'n!', 'nCr=n!/r!(n-r)!'],
                weight: 1.0
            },
            probability: {
                displayName: 'Probability',
                keywords: ['probability', 'probable', 'likely', 'chance', 'odds', 'favorable', 'dice', 'coin', 'cards', 'random', 'outcomes', 'expected'],
                formulas: ['probability-formula', 'conditional-probability', 'bayes-theorem'],
                weight: 0.9
            }
        }
    },
    GEOMETRY: {
        displayName: 'Geometry',
        subTopics: {
            triangles: {
                displayName: 'Triangles',
                keywords: ['triangle', 'equilateral', 'isosceles', 'right angle', 'hypotenuse', 'altitude', 'median', 'centroid', 'orthocenter', 'incircle', 'circumcircle', 'similar', 'congruent', 'acute', 'obtuse', 'scalene', 'pythagorean'],
                formulas: ['area-triangle', 'heron-formula', 'sine-rule', 'cosine-rule', 'similarity-ratios', '1/2×base×height', 'pythagorean-theorem'],
                weight: 1.2,
                analytics: { catWeight: 1.4, avgTimeBleed: 25, commonMistakeType: 'calculation' }
            },
            circles: {
                displayName: 'Circles',
                keywords: ['circle', 'radius', 'diameter', 'chord', 'tangent', 'sector', 'segment', 'arc', 'concentric', 'inscribed', 'circumscribed', 'circumference', 'semicircle'],
                formulas: ['area-circle', 'sector-area', 'tangent-properties', 'cyclic-quadrilateral', 'πr²', '2πr'],
                weight: 1.1
            },
            quadrilaterals: {
                displayName: 'Quadrilaterals',
                keywords: ['rectangle', 'square', 'parallelogram', 'rhombus', 'trapezium', 'trapezoid', 'quadrilateral', 'diagonal', 'sides', 'vertices'],
                formulas: ['area-formulas', 'diagonal-properties', 'parallelogram-area'],
                weight: 1.0
            },
            polygons: {
                displayName: 'Polygons',
                keywords: ['polygon', 'hexagon', 'octagon', 'pentagon', 'regular polygon', 'interior angle', 'exterior angle', 'diagonal', 'sides', 'vertices', 'n-gon'],
                formulas: ['sum-of-angles', 'number-of-diagonals', '(n-2)×180', 'n(n-3)/2'],
                weight: 0.9
            },
            coordinate: {
                displayName: 'Coordinate Geometry',
                keywords: ['coordinate', 'x-axis', 'y-axis', 'slope', 'intercept', 'midpoint', 'distance formula', 'section formula', 'line', 'point', 'origin', 'xy-plane', 'graph'],
                formulas: ['distance-formula', 'section-formula', 'slope-intercept', 'area-coordinates', '√((x₂-x₁)²+(y₂-y₁)²)'],
                weight: 1.0
            },
            mensuration: {
                displayName: 'Mensuration',
                keywords: ['area', 'perimeter', 'surface area', 'volume', 'mensuration', 'cylinder', 'cone', 'sphere', 'cube', 'cuboid', 'hemisphere', 'prism'],
                formulas: ['volume-formulas', 'surface-area-formulas', 'frustum', '4/3πr³', 'πr²h'],
                weight: 1.0
            }
        }
    },
    PROGRESSIONS: {
        displayName: 'Progressions & Series',
        subTopics: {
            ap: {
                displayName: 'Arithmetic Progression',
                keywords: ['arithmetic progression', 'ap', 'common difference', 'arithmetic mean', 'first term', 'last term', 'nth term', 'sum of n terms', 'a.p.', 'd', 'sequence'],
                formulas: ['ap-nth-term', 'ap-sum', 'arithmetic-mean', 'a+(n-1)d', 'n/2(2a+(n-1)d)', 'n/2(a+l)'],
                weight: 1.1,
                analytics: { catWeight: 1.2, avgTimeBleed: 20, commonMistakeType: 'calculation' }
            },
            gp: {
                displayName: 'Geometric Progression',
                keywords: ['geometric progression', 'gp', 'common ratio', 'geometric mean', 'infinite gp', 'sum to infinity', 'g.p.', 'r', 'ratio'],
                formulas: ['gp-nth-term', 'gp-sum', 'infinite-gp-sum', 'ar^(n-1)', 'a(r^n-1)/(r-1)', 'a/(1-r)'],
                weight: 1.0
            },
            specialSequences: {
                displayName: 'Special Sequences',
                keywords: ['fibonacci', 'triangular number', 'square number', 'sum of squares', 'sum of cubes', 'special series', 'harmonic', 'hp', 'h.p.'],
                formulas: ['sum-of-squares', 'sum-of-cubes', 'special-sums', 'n(n+1)(2n+1)/6', 'n²(n+1)²/4'],
                weight: 0.8
            }
        }
    }
};

// Build reverse mapping: keyword -> [{category, subTopic, weight}]
const buildReverseMapping = () => {
    const mapping = {};

    for (const [category, catData] of Object.entries(TOPIC_TAXONOMY)) {
        for (const [subTopic, subData] of Object.entries(catData.subTopics)) {
            for (const keyword of subData.keywords) {
                const lowerKey = keyword.toLowerCase();
                if (!mapping[lowerKey]) {
                    mapping[lowerKey] = [];
                }
                mapping[lowerKey].push({
                    category,
                    subTopic,
                    displayName: subData.displayName,
                    weight: subData.weight || 1.0
                });
            }
            // Also add formulas as keywords with slightly lower weight
            for (const formula of subData.formulas) {
                const lowerKey = formula.toLowerCase().replace(/-/g, ' ');
                if (!mapping[lowerKey]) {
                    mapping[lowerKey] = [];
                }
                mapping[lowerKey].push({
                    category,
                    subTopic,
                    displayName: subData.displayName,
                    weight: (subData.weight || 1.0) * 0.8
                });
            }
        }
    }

    return mapping;
};

export const KEYWORD_TO_TOPICS = buildReverseMapping();

// Formula detection patterns (regex patterns for common math formulas)
export const FORMULA_PATTERNS = {
    quadratic: /[a-zA-Z][²2]\s*[+\-]\s*[a-zA-Z]\s*[+\-]\s*\d+\s*=\s*0|ax²\s*\+\s*bx\s*\+\s*c|quadratic\s+equation/gi,
    sumOfRoots: /(sum\s*(of)?\s*roots|α\s*\+\s*β|alpha\s*\+\s*beta|\-b\/a)/gi,
    productOfRoots: /(product\s*(of)?\s*roots|α\s*[×·*]\s*β|alpha\s*[×·*]\s*beta|αβ|c\/a)/gi,
    apFormula: /(a\s*\+\s*\(?\s*n\s*-?\s*1\s*\)?\s*d|Sn\s*=\s*n\/2|arithmetic\s+progression|common\s+difference)/gi,
    gpFormula: /(a\s*[×·*r]\s*r\^|ar\^?n|geometric\s+(mean|progression)|common\s+ratio)/gi,
    profitLoss: /(profit\s*%|loss\s*%|sp\s*[-=]\s*cp|cp\s*[+\-]\s*profit|selling\s+price|cost\s+price)/gi,
    percentage: /(\d+\s*%|percentage\s+(of|change|increase|decrease))/gi,
    timeSpeed: /(speed\s*=\s*distance|d\s*=\s*s\s*[×·*]\s*t|relative\s+speed|km\s*\/\s*h)/gi,
    interest: /(P\s*[×·*R]\s*R?\s*[×·*T]\s*T?\/100|compound\s+interest|simple\s+interest|principal|ci|si)/gi,
    remainder: /(mod\s*\d+|remainder\s+(when|is|after)|divided\s+by.*remainder)/gi,
    areaFormulas: /(1\/2\s*[×·*]\s*b\s*[×·*]\s*h|πr²|area\s+(of|=)|base\s*[×·*]\s*height)/gi,
    hcfLcm: /(hcf|lcm|gcd|highest\s+common\s+factor|least\s+common\s+multiple)/gi,
    pythagorean: /(a²\s*\+\s*b²\s*=\s*c²|pythagor|hypotenus)/gi,
    logarithm: /(log[₁₂₃₄₅₆₇₈₉₀]|log\s*\(|ln\s*\(|antilog|change\s+of\s+base)/gi
};

// Get all keywords for a category
export const getKeywordsForCategory = (category) => {
    const catData = TOPIC_TAXONOMY[category];
    if (!catData) return [];

    const keywords = [];
    for (const subData of Object.values(catData.subTopics)) {
        keywords.push(...subData.keywords);
    }
    return [...new Set(keywords)];
};

// Get display name for a category
export const getCategoryDisplayName = (category) => {
    return TOPIC_TAXONOMY[category]?.displayName || category;
};

// Get all sub-topics for a category
export const getSubTopicsForCategory = (category) => {
    const catData = TOPIC_TAXONOMY[category];
    if (!catData) return [];

    return Object.entries(catData.subTopics).map(([key, data]) => ({
        key,
        displayName: data.displayName,
        keywords: data.keywords
    }));
};

export default TOPIC_TAXONOMY;
