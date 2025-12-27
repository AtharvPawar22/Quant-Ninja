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
        insight: {
            approach: 'Add the speeds to find the rate at which distance decreases.',
            formula: 'Speed_Relative = S₁ + S₂',
            trap: 'Units mismatch (km/hr vs m/s) is the #1 error here.',
            memory: 'OPPOSITE = ADD (They are helping each other cover the gap)'
        },
        variants: [
            'Two runners start from opposite ends of a 400m track...',
            'A dog and its owner run towards each other from a distance...',
            'Two cities are 500km apart and cars leave simultaneously towards each other.'
        ],
        pyqId: 26,
        distractors: ['Time & Work', 'Average Speed', 'Circular Track']
    },
    {
        id: 'tsd-circular',
        category: 'ARITHMETIC',
        subTopic: 'timeSpeed',
        name: 'Circular Track meeting',
        stem: 'Two runners start at the same point on a circular track of 400m...',
        triggers: ['circular track', 'same point', 'meeting for the first time'],
        insight: {
            approach: 'Relative speed applies to circumference. T = L / (S₁ ± S₂)',
            formula: 'T_first = Length / Relative_Speed',
            trap: 'Mixing "same direction" (-) and "opposite direction" (+).',
            memory: 'CIRCULAR = LINEAR but the finish line wraps around to the start.'
        },
        variants: [
            'A and B run in a loop of 1km...',
            'Cyclists going around a park and meeting at the starting point...',
            'Two ants crawling on a round clock face.'
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
        insight: {
            approach: 'Calculate work done in one full cycle (sum of rates).',
            formula: 'Cycle_Work = R_A + R_B + R_C',
            trap: 'The last few units of work might not need a full cycle.',
            memory: 'Think in "Packets" of days instead of individual days.'
        },
        variants: [
            'Three pipes filling a tank one after another every hour...',
            'A, B and C working on alternate days to build a wall...',
            'A person reading 10 pages on odd days and 20 on even days.'
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
        insight: {
            approach: 'Fill rate is positive, drain/leak rate is negative.',
            formula: 'Net_Rate = 1/Inlet - 1/Outlet',
            trap: 'Not checking if the outlet is faster than the inlet (tank will never fill).',
            memory: 'It is just addition/subtraction of speed (work per hour).'
        },
        variants: [
            'A tank with a leak in the bottom while a tap is filling it...',
            'Emptying a pool while it is raining...',
            'Pumping air into a balloon that has a small hole.'
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
        insight: {
            approach: 'Use algebraic identities to avoid calculating actual roots.',
            formula: 'α³+β³ = (α+β)³ - 3αβ(α+β)',
            trap: 'Waste of time solving the quadratic equation manually.',
            memory: 'Roots are friends; relationships (sum/product) are stronger than individuals.'
        },
        variants: [
            'Given x² + bx + c = 0, find 1/α + 1/β...',
            'Finding α² + β² when the equation is known...',
            'Relationship between coefficients and powers of roots.'
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
        insight: {
            approach: 'Express N = ak + r and iterate to find common value.',
            formula: 'N = 3k + 2; check k values for (3k+2) mod 5 = 3',
            trap: 'Not checking if a common difference exists between divisor and remainder.',
            memory: 'Iterative jumping: Start at 2, jump by 3s until you hit (mod 5 = 3).'
        },
        variants: [
            'Smallest number giving remainder 1 with 4, 5, and 6...',
            'Finding numbers of the form 7k+1 and 11m+2...',
            'A bell ringing every 4 mins with 1 min offset.'
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
        insight: {
            approach: 'Use combinations (nCr) when the order of selection doesn\'t matter.',
            formula: 'nCr = n! / [r! * (n-r)!]',
            trap: 'Using Permutations (nPr) when order is irrelevant (like picking a team).',
            memory: 'C for Choose (Team), P for Place (Queue).'
        },
        variants: [
            'Selecting 5 cards from a deck...',
            'Number of ways to pick fruits from a basket...',
            'Forming triangles from n points on a plane.'
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
        insight: {
            approach: 'Total outcomes = 6² = 36. Identify favorable pairs.',
            formula: 'P = Favorable / 36',
            trap: 'Double counting (5,6) and (6,5) or missing a pair.',
            memory: 'Sum 7 is the most common (peak of the pyramid).'
        },
        variants: [
            'Probability of getting a prime sum with two dice...',
            'Ways to get a sum < 5...',
            'Dice games where sum determines the winner.'
        ],
        pyqId: 186,
        distractors: ['Independent Events', 'Conditional Prob', 'Permutations']
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
