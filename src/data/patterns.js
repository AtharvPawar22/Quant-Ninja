// Comprehensive CAT Quant Pattern Database for Muscle Memory Training
// Each pattern represents a "signature" of a common type of question.

export const PATTERNS = [
    // --- ARITHMETIC: TIME, SPEED & DISTANCE ---
    {
        id: 'tsd-relative-opp',
        category: 'ARITHMETIC',
        subTopic: 'timeSpeed',
        name: 'Relative Speed (Opposite)',
        stem: 'Two trains start simultaneously from A and B towards each other...',
        triggers: ['towards each other', 'from opposite ends', 'meet in the middle'],
        catFrequency: 'high',
        thinkSpeed: '30s',
        questionFormat: 'both',
        mentalShortcut: 'OPPOSITE = ADD speeds to find combined rate.',
        trapAnswer: 'Units mismatch (km/hr vs m/s).',
        relatedPatterns: ['tsd-circular', 'tsd-train-pole'],
        variants: [
            {
                text: 'Two trains start simultaneously from A and B, 450 km apart, towards each other at 40 km/hr and 50 km/hr. When will they meet?',
                format: 'TITA',
                answer: 5,
                solution: 'Relative speed = 40 + 50 = 90 km/hr. Time = 450 / 90 = 5 hours.'
            },
            {
                text: 'Two runners start from opposite ends of a 400m track at 5m/s and 3m/s. They will meet in:',
                format: 'MCQ',
                options: ['50s', '40s', '80s', '100s'],
                answer: '50s',
                solution: 'Relative speed = 5 + 3 = 8 m/s. Time = 400 / 8 = 50 seconds.'
            }
        ],
        pyqId: 26,
        distractors: ['Time & Work', 'Average Speed', 'Circular Track']
    },
    {
        id: 'pc-linear-gap',
        category: 'NUMBER_SYSTEM',
        subTopic: 'counting',
        name: 'Gap Method (No two adjacent)',
        stem: 'In how many ways can 5 boys and 3 girls be seated such that no two girls are together?',
        triggers: ['no two together', 'not adjacent', 'separated'],
        catFrequency: 'high',
        thinkSpeed: '60s',
        questionFormat: 'both',
        mentalShortcut: 'Arrange boys first, then place girls in gaps. Ways = n! * (n+1)Cr * r!',
        trapAnswer: 'Total - (all together) is wrong. "No two together" is different from "not all together".',
        relatedPatterns: ['pc-linear-arr', 'pc-circular-gap'],
        variants: [
            {
                text: '6 men and 4 women sit in a row. No two women sit together. How many ways?',
                format: 'TITA',
                answer: 604800,
                solution: 'Arrange 6 men: 6! = 720. Gaps = 7. Choose 4 gaps for women: 7C4 = 35. Arrange 4 women: 4! = 24. Total = 720 * 35 * 24 = 604800.'
            }
        ],
        pyqId: 177,
        distractors: ['Total - Together', 'Circular Arrangement', 'Simple Selection']
    },
    {
        id: 'pc-circular-fixed',
        category: 'NUMBER_SYSTEM',
        subTopic: 'counting',
        name: 'Circular (Fixed Position)',
        stem: '8 people sit around a table such that the host always sits at a fixed chair...',
        triggers: ['around a table', 'circular', 'fixed position'],
        catFrequency: 'medium',
        thinkSpeed: '30s',
        questionFormat: 'MCQ',
        mentalShortcut: 'If one position is fixed, circular becomes linear: (n-1)!',
        trapAnswer: 'Using n! instead of (n-1)!',
        relatedPatterns: ['pc-linear-arr', 'pc-circular-gap'],
        variants: [
            {
                text: 'In how many ways can 6 people be seated around a circular table?',
                format: 'MCQ',
                options: ['120', '720', '24', '60'],
                answer: '120',
                solution: '(6-1)! = 5! = 120.'
            }
        ],
        pyqId: 178,
        distractors: ['n!', 'nPr', 'nCr']
    },
    {
        id: 'prob-conditional-basic',
        category: 'NUMBER_SYSTEM',
        subTopic: 'probability',
        name: 'Conditional Probability',
        stem: 'Probability of A given B has occurred...',
        triggers: ['given that', 'if it is known', 'conditional'],
        catFrequency: 'high',
        thinkSpeed: '45s',
        questionFormat: 'MCQ',
        mentalShortcut: 'P(A|B) = P(A ∩ B) / P(B)',
        trapAnswer: 'Using P(A) instead of the reduced sample space P(B).',
        relatedPatterns: ['prob-independent', 'prob-bayes'],
        variants: [
            {
                text: 'A die is rolled. If it is known that the number is even, what is the probability it is 6?',
                format: 'MCQ',
                options: ['1/3', '1/6', '1/2', '2/3'],
                answer: '1/3',
                solution: 'Reduced sample space = {2, 4, 6}. Favorable = {6}. Prob = 1/3.'
            }
        ],
        pyqId: 187,
        distractors: ['1/6', '1/2', '1/4']
    },
    {
        id: 'tsd-circular',
        category: 'ARITHMETIC',
        subTopic: 'timeSpeed',
        name: 'Circular Track meeting',
        stem: 'Two runners start at the same point on a circular track of 400m...',
        triggers: ['circular track', 'same point', 'meeting for the first time'],
        catFrequency: 'medium',
        thinkSpeed: '60s',
        questionFormat: 'MCQ',
        mentalShortcut: 'In circular, relative speed is distance around the loop.',
        trapAnswer: 'Mixing "same direction" (-) and "opposite direction" (+).',
        relatedPatterns: ['tsd-relative-opp', 'tsd-relative-same'],
        variants: [
            {
                text: 'A and B run in opposite directions on a 400m circular track at 8m/s and 2m/s. After how many seconds will they meet for the first time?',
                format: 'MCQ',
                options: ['40s', '50s', '20s', '100s'],
                answer: '40s',
                solution: 'Relative speed (opposite) = 8 + 2 = 10 m/s. Time = 400 / 10 = 40s.'
            }
        ],
        pyqId: 282,
        distractors: ['Relative Speed (Linear)', 'Ratios', 'Percentages']
    },

    // --- ARITHMETIC: TIME & WORK ---
    {
        id: 'work-alternating',
        category: 'ARITHMETIC',
        subTopic: 'timeWork',
        name: 'Alternating Work',
        stem: 'A works on Day 1, B on Day 2, C on Day 3, and the cycle repeats...',
        triggers: ['alternating', 'Day 1, Day 2', 'cycle repeats'],
        catFrequency: 'high',
        thinkSpeed: '60s',
        questionFormat: 'both',
        mentalShortcut: 'Work in one full cycle = sum of rates.',
        trapAnswer: 'The last few units of work might not need a full cycle.',
        relatedPatterns: ['work-pipes-drain', 'work-together'],
        variants: [
            {
                text: 'A, B and C can do a work in 12, 15 and 20 days. They work on alternate days starting with A, then B, then C. In how many days is it finished?',
                format: 'TITA',
                answer: 15,
                solution: 'Total work = LCM(12,15,20) = 60. Rates: A=5, B=4, C=3. 3-day cycle work = 5+4+3=12. Cycles needed = 60/12 = 5 cycles. Total days = 5 * 3 = 15 days.'
            }
        ],
        pyqId: 17,
        distractors: ['Pipes & Cisterns', 'Ratios', 'Averages']
    },
    {
        id: 'work-pipes-drain',
        category: 'ARITHMETIC',
        subTopic: 'timeWork',
        name: 'Inlet & Outlet Pipes',
        stem: 'Pipe A fills in 10h, Pipe B drains in 15h. If both are open...',
        triggers: ['inlet', 'outlet', 'drains', 'leak'],
        catFrequency: 'medium',
        thinkSpeed: '30s',
        questionFormat: 'MCQ',
        mentalShortcut: 'Net Rate = Fill Rate - Drain Rate.',
        trapAnswer: 'Not checking if the outlet is faster than the inlet.',
        relatedPatterns: ['work-alternating', 'work-efficiency-change'],
        variants: [
            {
                text: 'Pipe A fills a tank in 10 hours and Pipe B empties it in 15 hours. If both are opened together, the tank is full in:',
                format: 'MCQ',
                options: ['30h', '25h', '12h', '20h'],
                answer: '30h',
                solution: 'Net rate = 1/10 - 1/15 = (3-2)/30 = 1/30. Time = 30 hours.'
            }
        ],
        pyqId: 51,
        distractors: ['Time & Speed', 'Mixtures', 'Percentages']
    },

    // --- ARITHMETIC: PROFIT & LOSS ---
    {
        id: 'pl-marked-price',
        category: 'ARITHMETIC',
        subTopic: 'profitLoss',
        name: 'Markup and Discount',
        stem: 'Trader marks up by 40% and then gives a 20% discount...',
        triggers: ['marks up', 'discount', 'marked price'],
        insight: {
            approach: 'Successive percentage changes. Final = CP * (1+m) * (1-d).',
            formula: 'Net Change = m - d - (md/100)',
            trap: 'Applying discount on Cost Price instead of Marked Price.',
            memory: 'Chain: CP -> (+Markup) -> MP -> (-Discount) -> SP.'
        },
        variants: [
            'A shopkeeper tags an item 50% above cost and offers 10% off...',
            'Double discounts of 10% and 20% on a list price...',
            'Calculating profit after a 25% markup and 15% clearance sale.'
        ],
        pyqId: 16,
        distractors: ['Simple Interest', 'Ratios', 'Successive Change']
    },
    {
        id: 'pl-equal-sp',
        category: 'ARITHMETIC',
        subTopic: 'profitLoss',
        name: 'Equal SP, different Profit/Loss',
        stem: 'Two articles sold at same price, one at 10% gain, other at 10% loss...',
        triggers: ['sold at same price', 'equal SP', 'x% gain and x% loss'],
        insight: {
            approach: 'Overall result is always a LOSS if percentages are equal.',
            formula: 'Loss % = (x/10)²',
            trap: 'Assuming "No Profit No Loss" because the percentages cancel out.',
            memory: 'Equal SP + Equal % = Always Sad (Loss).'
        },
        variants: [
            'Selling two houses for 1 Cr each, one at 20% profit, other 20% loss...',
            'Trading two watches at same price with symmetric gain/loss...',
            'Comparing net result of two products sold at $500 each.'
        ],
        pyqId: 40,
        distractors: ['No Profit No Loss', 'Weighted Average', 'Ratios']
    },

    // --- ALGEBRA: EQUATIONS ---
    {
        id: 'alg-quad-roots',
        category: 'ALGEBRA',
        subTopic: 'equations',
        name: 'Quadratic Roots Relationship',
        stem: 'Sum of roots is 5 and product of roots is 6. Find α³ + β³...',
        triggers: ['sum of roots', 'product of roots', 'roots are α and β'],
        catFrequency: 'high',
        thinkSpeed: '30s',
        questionFormat: 'both',
        mentalShortcut: 'α³ + β³ = (α+β)³ - 3αβ(α+β)',
        trapAnswer: 'Solving the quadratic for roots manually (too slow).',
        relatedPatterns: ['alg-quad-formation', 'alg-higher-powers'],
        variants: [
            {
                text: 'If the sum of roots of x² + bx + c = 0 is 5 and product is 6, what is the value of α³ + β³?',
                format: 'TITA',
                answer: 35,
                solution: 'α+β = 5, αβ = 6. α³+β³ = 5³ - 3(6)(5) = 125 - 90 = 35.'
            }
        ],
        pyqId: 2,
        distractors: ['Functions', 'Logarithms', 'Progressions']
    },
    {
        id: 'alg-modulus-eq',
        category: 'ALGEBRA',
        subTopic: 'inequalities',
        name: 'Modulus Equation Cases',
        stem: 'Solve for x: |x - 2| + |x + 5| = 10...',
        triggers: ['|x - a|', 'modulus', 'absolute value'],
        insight: {
            approach: 'Identify critical points (where mod is 0) and check regions.',
            formula: 'Case 1: x < -5, Case 2: -5 ≤ x < 2, Case 3: x ≥ 2',
            trap: 'Forgetting to check if the solution found fits the region chosen.',
            memory: 'MOD = Distance. The equation is asking for points with specific distances.'
        },
        variants: [
            'Number of solutions for |2x-3| = 5...',
            'Minimum value of |x-1| + |x-4|...',
            'Solving |x+2| + |x-2| = 4.'
        ],
        pyqId: 5,
        distractors: ['Linear Equations', 'Quadratic', 'Logarithms']
    },

    // --- ALGEBRA: LOGARITHMS ---
    {
        id: 'alg-log-base-change',
        category: 'ALGEBRA',
        subTopic: 'logarithms',
        name: 'Log Change of Base',
        stem: 'If log₂x + log₄x + log₁₆x = 7...',
        triggers: ['different bases', 'log with powers as base'],
        insight: {
            approach: 'Convert all logs to a common base (usually the smallest).',
            formula: 'log_{a^n}x = (1/n)log_ax',
            trap: 'Adding logs with different bases directly.',
            memory: 'Base power = Inverse multiplier. Base 4 (2²) -> 1/2 multiplier.'
        },
        variants: [
            'Simplifying log_3 x + log_9 x + log_27 x...',
            'Solving log_a b * log_b c...',
            'Equations with nested logarithms of different bases.'
        ],
        pyqId: 9,
        distractors: ['Exponents', 'Functions', 'Progressions']
    },

    // --- NUMBER SYSTEM: DIVISIBILITY ---
    {
        id: 'num-chinese-rem',
        category: 'NUMBER_SYSTEM',
        subTopic: 'remainders',
        name: 'Multiple Remainders',
        stem: 'N leaves remainder 2 when divided by 3 and 3 when divided by 5...',
        triggers: ['remainder x when divided by a', 'multiple divisors'],
        catFrequency: 'high',
        thinkSpeed: '60s',
        questionFormat: 'both',
        mentalShortcut: 'N = ak + r1 = bm + r2. Iterate or use LCM.',
        trapAnswer: 'Not checking for common difference (Divisor - Remainder).',
        relatedPatterns: ['num-remainder-theorem', 'num-euler-theorem'],
        variants: [
            {
                text: 'A number leaves remainder 2 when divided by 3 and 1 when divided by 4. Smallest such positive number is:',
                format: 'TITA',
                answer: 5,
                solution: 'N = 3k+2. For k=1, N=5. 5 divided by 4 leaves remainder 1. So 5 is the smallest.'
            }
        ],
        pyqId: 10,
        distractors: ['LCM/HCF', 'Factors', 'Digit Sum']
    },
    {
        id: 'num-factors-sq',
        category: 'NUMBER_SYSTEM',
        subTopic: 'factors',
        name: 'Perfect Square Factors',
        stem: 'How many factors of 2⁴ * 3⁵ * 5² are perfect squares?',
        triggers: ['factors', 'perfect squares', 'prime factorization'],
        insight: {
            approach: 'For a factor to be a square, prime powers in it must be even.',
            formula: 'Count = (p₁/2 + 1) * (p₂/2 + 1) * ...',
            trap: 'Just dividing the total number of factors by 2.',
            memory: 'SQUARES eat only EVEN power snacks (0, 2, 4...).'
        },
        variants: [
            'Number of perfect cube factors of a large number...',
            'Factors of 720 that are multiples of 4...',
            'Prime powers needed for a divisor to be a square.'
        ],
        pyqId: 49,
        distractors: ['Total Factors', 'Prime Factors', 'Unit Digit']
    },

    // --- GEOMETRY: TRIANGLES ---
    {
        id: 'geo-sim-tri',
        category: 'GEOMETRY',
        subTopic: 'triangles',
        name: 'Similar Triangles Area',
        stem: 'Ratio of sides of two similar triangles is 3:4. Ratio of areas?',
        triggers: ['similar triangles', 'ratio of sides', 'area ratio'],
        insight: {
            approach: 'Area ratio is the square of the side/linear ratio.',
            formula: 'Area₁/Area₂ = (Side₁/Side₂)²',
            trap: 'Using the side ratio (3/4) directly for the area ratio.',
            memory: '1D (sides) -> ratio; 2D (area) -> ratio²; 3D (volume) -> ratio³.'
        },
        variants: [
            'Ratio of perimeters of similar triangles...',
            'Area of a triangle formed by midpoints...',
            'Scaling a shape by a factor k and finding the new area.'
        ],
        pyqId: 3,
        distractors: ['Congruence', 'Perimeter Ratio', 'Midpoint Theorem']
    },

    // --- GEOMETRY: CIRCLES ---
    {
        id: 'geo-circle-tangent',
        category: 'GEOMETRY',
        subTopic: 'circles',
        name: 'Circle-Tangent Property',
        stem: 'Line intersection with circle at exactly one point...',
        triggers: ['tangent', 'touches circle', 'exactly one point'],
        insight: {
            approach: 'Distance from circle center to a tangent line equals the radius.',
            formula: 'Distance(Center, Line) = Radius',
            trap: 'Solving the quadratic for intersection and setting D=0 (too slow).',
            memory: 'Tangent = Just barely kissing the circle (radius distance).'
        },
        variants: [
            'Finding length of a tangent from an external point...',
            'Checking if a line 3x + 4y = k is tangent to a circle...',
            'Points of tangency on a coordinate plane.'
        ],
        pyqId: 43,
        distractors: ['Chords', 'Inscribed Angles', 'Coordinate Geometry']
    },

    // --- PROGRESSIONS ---
    {
        id: 'prog-ap-sum',
        category: 'PROGRESSIONS',
        subTopic: 'ap',
        name: 'Arithmetic Progression Sum',
        stem: 'Sum of first n terms where difference is constant...',
        triggers: ['sum of first n terms', 'constant difference', 'AP'],
        insight: {
            approach: 'Average of first and last term multiplied by number of terms.',
            formula: 'Sₙ = (n/2) * (a + l)',
            trap: 'Confusing the n-th term formula with the Sum formula.',
            memory: 'Sum = Average × Count.'
        },
        variants: [
            'Sum of first 100 natural numbers...',
            'Total seats in a stadium where each row has 2 more than the previous...',
            'Sum of all multiples of 7 between 100 and 500.'
        ],
        pyqId: 14,
        distractors: ['GP Sum', 'Average', 'Arithmetic Mean']
    },
    {
        id: 'prog-gp-inf',
        category: 'PROGRESSIONS',
        subTopic: 'gp',
        name: 'Infinite GP Sum',
        stem: 'A series goes 1 + 1/2 + 1/4 + 1/8 to infinity...',
        triggers: ['to infinity', 'infinite series', 'ratio < 1'],
        insight: {
            approach: 'Sum converges only if |-1 < r < 1|.',
            formula: 'S∞ = a / (1 - r)',
            trap: 'Applying formula when r > 1 (the sum would be infinity).',
            memory: 'The "Gap" left is always decreasing, approaching a limit.'
        },
        variants: [
            'Total distance traveled by a bouncing ball...',
            'Sum of 1 + 1/3 + 1/9 + ...',
            'Repeating decimals converted to fractions.'
        ],
        pyqId: 95,
        distractors: ['AP Sum', 'Limit', 'Harmonic Mean']
    },

    // --- ARITHMETIC: MIXTURES ---
    {
        id: 'arithm-mixture-alligation',
        category: 'ARITHMETIC',
        subTopic: 'ratiosProportion',
        name: 'Alligation/Mixtures',
        stem: 'Milk and water in one jar is 3:2, in another 7:3. In what ratio to mix...',
        triggers: ['mix', 'ratio to combine', 'resulting mixture'],
        insight: {
            approach: 'Use the Alligation cross-method to find quantity ratios.',
            formula: '(Higher - Mean) : (Mean - Lower)',
            trap: 'Mixing up which ratio goes with which quantity.',
            memory: 'Balanced Scale: The weights depend on the distance from the average.'
        },
        variants: [
            'Mixing two types of rice at different prices...',
            'Average age of a class when boys and girls are combined...',
            'A chemist mixing 20% acid and 50% acid solutions.'
        ],
        pyqId: 25,
        distractors: ['Percentages', 'Time & Work', 'Averages']
    },

    // --- NUMBER SYSTEM: DIGITS ---
    {
        id: 'num-unit-digit',
        category: 'NUMBER_SYSTEM',
        subTopic: 'digits',
        name: 'Unit Digit Cyclicity',
        stem: 'Find the last digit of 7^103...',
        triggers: ['unit digit', 'last digit', 'power'],
        insight: {
            approach: 'Units digits of powers follow a cycle of at most 4.',
            formula: 'Step 1: Find cyclicity. Step 2: Power mod Cycle.',
            trap: 'Assuming cyclicity is always 4 (some numbers like 5 or 6 have 1).',
            memory: 'Patern repeats: 7, 9, 3, 1, then back to 7.'
        },
        variants: [
            'Last digit of 2^55 + 3^55...',
            'Remainder when dividend is a power and divisor is 10...',
            'Unit digit of a large factorial sum.'
        ],
        pyqId: 107,
        distractors: ['Remainder Theorem', 'Factors', 'Place Value']
    },

    // --- ALGEBRA: MAXIMA/MINIMA ---
    {
        id: 'alg-am-gm',
        category: 'ALGEBRA',
        subTopic: 'maxMin',
        name: 'AM-GM Inequality',
        stem: 'Find the minimum value of x + 4/x for x > 0...',
        triggers: ['minimum value', 'x + k/x', 'product is constant'],
        insight: {
            approach: 'Arithmetic Mean ≥ Geometric Mean for positive numbers.',
            formula: '(a+b)/2 ≥ √ab',
            trap: 'Using AM-GM on numbers that could be negative.',
            memory: 'The "Sum" is smallest when the numbers are equal.'
        },
        variants: [
            'Maximum value of x(10-x)...',
            'Minimum of a/b + b/c + c/a...',
            'Solving for least value in symmetry problems.'
        ],
        pyqId: 48,
        distractors: ['Quadratic Maxima', 'Modulus', 'Logarithms']
    },

    // --- ARITHMETIC: INTEREST ---
    {
        id: 'arithm-diff-si-ci',
        category: 'ARITHMETIC',
        subTopic: 'interest',
        name: 'Difference SI vs CI',
        stem: 'Difference between CI and SI on a sum for 2 years at 10%...',
        triggers: ['difference between CI and SI', '2 years'],
        insight: {
            approach: 'The difference is essentially interest on the first year\'s interest.',
            formula: 'Diff = P(R/100)²',
            trap: 'Calculating CI and SI separately and then subtracting (slow).',
            memory: 'Extra money = Interest earned on the interest already earned.'
        },
        variants: [
            'Comparing 3-year differences (formula is slightly more complex)...',
            'Finding principal when diff and rate are given...',
            'Investment growth comparison.'
        ],
        pyqId: 53,
        distractors: ['Simple Interest', 'Compound Interest', 'Successive Change']
    },

    // --- MODERN MATH: P&C ---
    {
        id: 'modern-pc-selection',
        category: 'NUMBER_SYSTEM',
        subTopic: 'counting',
        name: 'Selection (nCr)',
        stem: 'Choose 2 ladies from 4 and 3 gents from 6 to form a committee...',
        triggers: ['choose', 'select', 'committee', 'without order'],
        catFrequency: 'high',
        thinkSpeed: '45s',
        questionFormat: 'both',
        mentalShortcut: 'C for Choose (Order doesn\'t matter), P for Place (Order matters).',
        trapAnswer: 'Using Permutations (nPr) when order is irrelevant.',
        relatedPatterns: ['pc-linear-gap', 'pc-linear-arr'],
        variants: [
            {
                text: 'How many ways can a committee of 3 be chosen from 10 members?',
                format: 'TITA',
                answer: 120,
                solution: '10C3 = (10*9*8)/(3*2*1) = 120.'
            },
            {
                text: 'Select 2 ladies from 4 and 3 gents from 6 to form a committee. Ways:',
                format: 'MCQ',
                options: ['120', '150', '90', '100'],
                answer: '120',
                solution: '4C2 * 6C3 = 6 * 20 = 120.'
            }
        ],
        pyqId: 176,
        distractors: ['Arrangement', 'Probability', 'Factorials']
    },
    {
        id: 'modern-prob-sum',
        category: 'NUMBER_SYSTEM',
        subTopic: 'probability',
        name: 'Dice Probability Sum',
        stem: 'Two dice are thrown. Find probability that sum is at least 10...',
        triggers: ['two dice', 'sum of faces', 'at least'],
        catFrequency: 'high',
        thinkSpeed: '45s',
        questionFormat: 'MCQ',
        mentalShortcut: 'Sum 7 is most common (6/36). Favorable/36.',
        trapAnswer: 'Double counting pairs or missing symmetric cases.',
        relatedPatterns: ['prob-independent', 'prob-conditional-basic'],
        variants: [
            {
                text: 'Two dice are thrown. What is the probability that the sum is at least 10?',
                format: 'MCQ',
                options: ['1/6', '5/36', '1/12', '1/4'],
                answer: '1/6',
                solution: 'Favorable cases: (4,6), (6,4), (5,5), (5,6), (6,5), (6,6) = 6 cases. Prob = 6/36 = 1/6.'
            }
        ],
        pyqId: 186,
        distractors: ['Independent Events', 'Conditional Prob', 'Permutations']
    },
    {
        id: 'alg-log-base-change',
        category: 'ALGEBRA',
        subTopic: 'logarithms',
        name: 'Log Change of Base',
        stem: 'If log_2 x + log_4 x + log_16 x = 7...',
        triggers: ['different bases', 'log with powers as base', 'log_a b'],
        catFrequency: 'high',
        thinkSpeed: '45s',
        questionFormat: 'both',
        mentalShortcut: 'log_{a^n} x = (1/n) log_a x. Base 4 is 2^2, so multiplier is 1/2.',
        trapAnswer: 'Adding logs with different bases directly without converting.',
        relatedPatterns: ['alg-log-product', 'alg-exponential'],
        variants: [
            {
                text: 'Solve for x: log_3 x + log_9 x + log_27 x = 11/2',
                format: 'TITA',
                answer: 27,
                solution: 'log_3 x + 1/2 log_3 x + 1/3 log_3 x = 11/2 => (1 + 1/2 + 1/3) log_3 x = 11/6 log_3 x = 11/2 => log_3 x = 3 => x = 27.'
            }
        ],
        pyqId: 9,
        distractors: ['Exponents', 'Functions', 'Progressions']
    },
    {
        id: 'alg-func-composite',
        category: 'ALGEBRA',
        subTopic: 'functions',
        name: 'Composite Functions',
        stem: 'If f(x) = 2x+3 and g(x) = x², find f(g(x))...',
        triggers: ['f(g(x))', 'fog', 'composite', 'nested function'],
        catFrequency: 'high',
        thinkSpeed: '30s',
        questionFormat: 'MCQ',
        mentalShortcut: 'Work from inside out: evaluate g(x) first, then plug into f.',
        trapAnswer: 'Confusing f(g(x)) with f(x)*g(x).',
        relatedPatterns: ['alg-func-inverse', 'alg-func-domain'],
        variants: [
            {
                text: 'If f(x) = x - 1 and g(x) = x² + 1, find f(g(2)).',
                format: 'MCQ',
                options: ['4', '5', '3', '2'],
                answer: '4',
                solution: 'g(2) = 2² + 1 = 5. f(g(2)) = f(5) = 5 - 1 = 4.'
            }
        ],
        pyqId: 75,
        distractors: ['Product of Functions', 'Inverse Functions', 'Domain']
    },
    {
        id: 'alg-mod-ineq',
        category: 'ALGEBRA',
        subTopic: 'inequalities',
        name: 'Modulus Inequalities',
        stem: 'Solve for x: |x - 3| < 5...',
        triggers: ['|x - a|', 'absolute value', 'inequality', 'range of x'],
        catFrequency: 'high',
        thinkSpeed: '30s',
        questionFormat: 'both',
        mentalShortcut: '|x-a| < k means -k < x-a < k. Distance from a is less than k.',
        trapAnswer: 'Only considering the positive case x-3 < 5.',
        relatedPatterns: ['alg-mod-eq', 'alg-ineq-am-gm'],
        variants: [
            {
                text: 'How many integer values of x satisfy |x + 2| <= 3?',
                format: 'TITA',
                answer: 7,
                solution: '-3 <= x + 2 <= 3 => -5 <= x <= 1. Integers: -5, -4, -3, -2, -1, 0, 1. Total = 7.'
            }
        ],
        pyqId: 164,
        distractors: ['Linear Equations', 'Absolute Difference', 'Quadratic']
    },
    {
        id: 'geo-coord-section',
        category: 'GEOMETRY',
        subTopic: 'coordinate',
        name: 'Section Formula',
        stem: 'Find coordinates of point P dividing line segment joining (1,2) and (4,8) in ratio 2:1...',
        triggers: ['dividing', 'ratio m:n', 'internally', 'coordinates of point'],
        catFrequency: 'medium',
        thinkSpeed: '45s',
        questionFormat: 'both',
        mentalShortcut: 'x = (mx2 + nx1)/(m+n), y = (my2 + ny1)/(m+n). Cross-multiply the ratio with coordinates.',
        trapAnswer: 'Swapping m and n in the formula.',
        relatedPatterns: ['geo-coord-midpoint', 'geo-coord-centroid'],
        variants: [
            {
                text: 'Point P divides AB in ratio 3:2. A is (1, -2) and B is (6, 8). x-coordinate of P is:',
                format: 'TITA',
                answer: 4,
                solution: 'x = (3*6 + 2*1)/(3+2) = (18+2)/5 = 20/5 = 4.'
            }
        ],
        pyqId: 168,
        distractors: ['Midpoint Formula', 'Distance Formula', 'Slope']
    },
    {
        id: 'geo-sim-tri-area',
        category: 'GEOMETRY',
        subTopic: 'triangles',
        name: 'Similar Triangles (Area)',
        stem: 'Ratio of sides of two similar triangles is 4:9. Find ratio of areas...',
        triggers: ['similar triangles', 'ratio of sides', 'area ratio'],
        catFrequency: 'high',
        thinkSpeed: '15s',
        questionFormat: 'MCQ',
        mentalShortcut: 'Area ratio = (Side ratio)². Side ratio = √(Area ratio).',
        trapAnswer: 'Using the side ratio directly without squaring.',
        relatedPatterns: ['geo-sim-tri-perimeter', 'geo-properties-centroid'],
        variants: [
            {
                text: 'The areas of two similar triangles are 25 cm² and 36 cm². If the side of the first is 10 cm, find the corresponding side of the second.',
                format: 'MCQ',
                options: ['12 cm', '14.4 cm', '8.33 cm', '15 cm'],
                answer: '12 cm',
                solution: 'Area ratio = 25/36. Side ratio = √(25/36) = 5/6. 5/6 = 10/x => x = 12.'
            }
        ],
        pyqId: 3,
        distractors: ['Perimeter Ratio', 'Congruence', 'Median Ratio']
    },
    {
        id: 'geo-mens-cone-sphere',
        category: 'GEOMETRY',
        subTopic: 'mensuration',
        name: 'Volume Comparison (Cone/Sphere)',
        stem: 'A cone and a sphere have equal radius R. If their volumes are equal, find height of cone...',
        triggers: ['equal radius', 'equal volume', 'cone', 'sphere', 'height'],
        catFrequency: 'medium',
        thinkSpeed: '45s',
        questionFormat: 'both',
        mentalShortcut: 'V_cone = 1/3 πR²h, V_sphere = 4/3 πR³. Equate and cancel 1/3 πR².',
        trapAnswer: 'Forgetting the 1/3 in cone volume or 4/3 in sphere volume.',
        relatedPatterns: ['geo-mens-cylinder', 'geo-mens-surface-area'],
        variants: [
            {
                text: 'If a cone of radius r and height h is melted to form a sphere of same radius, find h in terms of r.',
                format: 'TITA',
                answer: 4,
                solution: '1/3 πr²h = 4/3 πr³ => h = 4r. Answer factor is 4.'
            }
        ],
        pyqId: 156,
        distractors: ['Surface Area', 'Cylinder Volume', 'Total Surface Area']
    },
    {
        id: 'num-euler-totient',
        category: 'NUMBER_SYSTEM',
        subTopic: 'remainders',
        name: "Euler's Totient Remainder",
        stem: 'Find the remainder when a^n is divided by m, where a and m are co-prime...',
        triggers: ['remainder', 'co-prime', 'large power', 'divided by'],
        catFrequency: 'medium',
        thinkSpeed: '60s',
        questionFormat: 'both',
        mentalShortcut: "a^Φ(m) ≡ 1 (mod m). Reduce power n mod Φ(m).",
        trapAnswer: "Using Fermat's Little Theorem when the divisor is not prime.",
        relatedPatterns: ['num-remainder-theorem', 'num-chinese-rem'],
        variants: [
            {
                text: 'Find the remainder when 3^102 is divided by 10.',
                format: 'TITA',
                answer: 9,
                solution: 'Φ(10) = 10(1-1/2)(1-1/5) = 4. 102 mod 4 = 2. 3^2 mod 10 = 9.'
            }
        ],
        pyqId: 108,
        distractors: ['Unit Digit', 'Pattern Matching', 'Cyclicity']
    },
    {
        id: 'num-factor-count',
        category: 'NUMBER_SYSTEM',
        subTopic: 'factors',
        name: 'Total Number of Factors',
        stem: 'Find the number of factors of 720...',
        triggers: ['number of factors', 'divisors', 'how many factors'],
        catFrequency: 'high',
        thinkSpeed: '30s',
        questionFormat: 'both',
        mentalShortcut: 'Prime factorize: 2^a * 3^b * ... Count = (a+1)(b+1)...',
        trapAnswer: 'Missing a prime factor during factorization.',
        relatedPatterns: ['num-factor-sum', 'num-factor-product'],
        variants: [
            {
                text: 'How many factors does 120 have?',
                format: 'TITA',
                answer: 16,
                solution: '120 = 2³ * 3¹ * 5¹. Count = (3+1)(1+1)(1+1) = 4 * 2 * 2 = 16.'
            }
        ],
        pyqId: 124,
        distractors: ['Prime Factors', 'Sum of Factors', 'Odd Factors']
    },
    {
        id: 'num-unit-digit-complex',
        category: 'NUMBER_SYSTEM',
        subTopic: 'digits',
        name: 'Complex Unit Digit',
        stem: 'Find the unit digit of (17^23) * (13^45) * (12^67)...',
        triggers: ['unit digit', 'last digit', 'product of powers'],
        catFrequency: 'high',
        thinkSpeed: '45s',
        questionFormat: 'MCQ',
        mentalShortcut: 'Find cyclicity of each base. Reduce each power mod 4 (or its cycle). Multiply unit digits.',
        trapAnswer: 'Calculating the full product or not observing cyclicity of 4.',
        relatedPatterns: ['num-remainder-theorem', 'num-base-system'],
        variants: [
            {
                text: 'The unit digit of 2^33 * 3^44 is:',
                format: 'MCQ',
                options: ['2', '4', '6', '8'],
                answer: '2',
                solution: '2^33: 33 mod 4 = 1 => 2^1 = 2. 3^44: 44 mod 4 = 0 => 3^4 = 1. 2 * 1 = 2.'
            }
        ],
        pyqId: 107,
        distractors: ['Tens Digit', 'Remainder System', 'Factors']
    }
];

export const CATEGORIES = [
    { id: 'ALL', name: 'Mixed Challenge' },
    { id: 'ARITHMETIC', name: 'Arithmetic' },
    { id: 'ALGEBRA', name: 'Algebra' },
    { id: 'NUMBER_SYSTEM', name: 'Number System' },
    { id: 'GEOMETRY', name: 'Geometry' },
    { id: 'PROGRESSIONS', name: 'Progressions' }
];

export const DIFFICULTIES = [
    { id: 'beginner', name: 'Beginner', time: 10 },
    { id: 'intermediate', name: 'Intermediate', time: 5 },
    { id: 'ninja', name: 'Ninja', time: 3 }
];
