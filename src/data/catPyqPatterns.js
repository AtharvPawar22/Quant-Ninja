// CAT Quantitative Aptitude PYQ Patterns (2021-2025)
// Reference database for generating CAT-style questions

export const CAT_PYQ_PATTERNS = {
    arithmetic: {
        percentages: [
            {
                pattern: "Successive percentage changes with discount and markup",
                example: "A shopkeeper marks up an article by 40% above cost price and offers two successive discounts of 20% and 10%. If he still makes a profit of 8%, what percentage discount should he offer on a single discount to earn the same profit?",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "Use successive percentage formula: Final = Initial × (1 + r₁/100) × (1 + r₂/100)"
            },
            {
                pattern: "Population/investment growth with compound rates",
                example: "A city's population increases by 10% in the first year and decreases by 10% in the second year. If the final population is 39,600, what was the initial population?",
                difficulty: "easy",
                catYear: "2024",
                solutionApproach: "Work backwards: Final = Initial × (1.1) × (0.9)"
            }
        ],

        ratios: [
            {
                pattern: "Three-way ratio comparison",
                example: "In a college, the ratio of boys to girls is 7:5. If the number of girls increases by 20% and boys decrease by 10%, what is the new ratio?",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "Convert to common base, apply percentage changes"
            },
            {
                pattern: "Mixture and Alligation with replacement",
                example: "From a container of 60 liters of milk, 12 liters are replaced with water. This process is repeated once more. Find the final quantity of milk.",
                difficulty: "hard",
                catYear: "2022",
                solutionApproach: "Final = Initial(1 - r/V)^n"
            }
        ],

        timeSpeed: [
            {
                pattern: "Relative speed in opposite directions (Meeting time)",
                example: "Two trains start from A and B toward each other at 40 km/h and 50 km/h. If distance AB is 450 km, when they meet?",
                difficulty: "easy",
                catYear: "2024",
                solutionApproach: "Time = Distance / (S1 + S2)"
            }
        ],

        timeWork: [
            {
                pattern: "Efficiency changes and remaining work",
                example: "A is twice as efficient as B. They work together for 5 days, then A leaves. B finishes the rest in 10 days. How many days would A take alone?",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "Assign efficiencies (2, 1), find total work, solve for A."
            }
        ]
    },

    algebra: {
        logarithms: [
            {
                pattern: "Logarithmic sum with different bases (Change of base)",
                example: "log_3 x + log_9 x + log_27 x = 11/2. Find x.",
                difficulty: "medium",
                catYear: "2024",
                solutionApproach: "Use log_{a^n} x = (1/n) log_a x to unify bases to 3."
            }
        ],
        functions: [
            {
                pattern: "Composite function root count",
                example: "If f(x) = x² - 4x + 3, how many real roots does f(f(x)) = 0 have?",
                difficulty: "hard",
                catYear: "2023",
                solutionApproach: "Solve f(x) = t where f(t) = 0."
            }
        ],
        inequalities: [
            {
                pattern: "Modulus inequalities with integer solutions",
                example: "Find the number of integers x satisfying |x-2| + |x+3| <= 7.",
                difficulty: "hard",
                catYear: "2022",
                solutionApproach: "Divide into cases (x < -3, -3 <= x < 2, x >= 2)."
            }
        ]
    },

    numberSystem: {
        remainders: [
            {
                pattern: "Euler's Totient Theorem for large powers",
                example: "Find the remainder when 3^102 is divided by 10.",
                difficulty: "medium",
                catYear: "2024",
                solutionApproach: "Φ(10) = 4, find 3^(102 mod 4) mod 10."
            }
        ],
        counting: [
            {
                pattern: "Gap method for restricted arrangements",
                example: "6 men and 4 women sit in a row. No two women sit together. How many ways?",
                difficulty: "hard",
                catYear: "2022",
                solutionApproach: "Arrange men first (5!), then women in gaps (6P4)."
            }
        ]
    },

    geometry: {
        coordinate: [
            {
                pattern: "Section formula for ratio division",
                example: "Find point P dividing (1,-2) and (6,8) in ratio 3:2.",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "Use (mx2+nx1)/(m+n)."
            }
        ]
    }
};

// Difficulty distribution for CAT (2021-2025 average)
export const CAT_DIFFICULTY_DISTRIBUTION = {
    easy: 0.30,    // 30%
    medium: 0.45,  // 45%
    hard: 0.25     // 25%
};

// Question type distribution
export const CAT_QUESTION_TYPES = {
    MCQ: 0.70,     // 70% Multiple Choice
    TITA: 0.30     // 30% Type In The Answer
};

// Topic-based keywords for matching notes to CAT patterns
export const TOPIC_KEYWORDS = {
    percentages: ["percentage", "percent", "%", "increase", "decrease", "discount", "markup"],
    ratios: ["ratio", "proportion", "variation", "divide in ratio"],
    profitLoss: ["profit", "loss", "cost price", "selling price", "CP", "SP", "gain"],
    siCi: ["simple interest", "compound interest", "SI", "CI", "principal", "rate", "time"],
    equations: ["equation", "solve for", "quadratic", "roots", "linear"],
    progressions: ["AP", "GP", "arithmetic progression", "geometric progression", "series"],
    divisibility: ["divisible", "remainder", "modulo", "HCF", "LCM", "GCD"],
    factors: ["factors", "prime", "divisors", "composite"],
    triangles: ["triangle", "pythagorean", "similar", "congruent"],
    circles: ["circle", "radius", "diameter", "circumference", "inscribed", "circumscribed"],
    mensuration: ["area", "volume", "surface area", "cylinder", "cone", "sphere", "cube"],
    permutationCombination: ["permutation", "combination", "arrange", "select", "nPr", "nCr"],
    probability: ["probability", "dice", "cards", "random", "outcomes"]
};

export default CAT_PYQ_PATTERNS;
