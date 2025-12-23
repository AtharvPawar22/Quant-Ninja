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
                pattern: "Ratio with equal allocation problems",
                example: "A sum of money is divided among A, B, and C in the ratio 2:3:5. If C gets ₹3000 more than A, find the total sum.",
                difficulty: "easy",
                catYear: "2024",
                solutionApproach: "Ratio difference × multiplier = actual difference"
            }
        ],

        profitLoss: [
            {
                pattern: "Mixed profit and loss with selling price",
                example: "A trader sells two articles at ₹990 each. On one he gains 10% and on the other he loses 10%. What is his overall profit or loss percentage?",
                difficulty: "medium",
                catYear: "2022",
                solutionApproach: "For equal selling prices with equal % profit and loss, there's always a net loss = (p%)²/100"
            }
        ],

        siCi: [
            {
                pattern: "Compound interest with different compounding periods",
                example: "Find the difference between compound interest (compounded annually) and simple interest on ₹8000 at 10% per annum for 2 years.",
                difficulty: "easy",
                catYear: "2024",
                solutionApproach: "Difference = P(R/100)²"
            },
            {
                pattern: "Time period calculation in CI",
                example: "In how many years will a sum of money double itself at 8% compound interest per annum?",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "Use rule of 72 or solve: 2 = (1.08)^n"
            }
        ]
    },

    algebra: {
        equations: [
            {
                pattern: "Age-related problems with equations",
                example: "The sum of ages of a father and son is 45 years. Five years ago, the product of their ages was 4 times the father's age at that time. Find their present ages.",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "Set up simultaneous equations with (f-5) and (s-5)"
            },
            {
                pattern: "Quadratic equation with sum/product of roots",
                example: "If α and β are roots of x² - 5x + 6 = 0, find the value of α³ + β³.",
                difficulty: "hard",
                catYear: "2022",
                solutionApproach: "Use α + β = 5, αβ = 6, and identity α³ + β³ = (α + β)³ - 3αβ(α + β)"
            }
        ],

        progressions: [
            {
                pattern: "AP with sum of n terms",
                example: "The sum of first 20 terms of an AP is 400 and the sum of first 40 terms is 1600. Find the sum of next 20 terms.",
                difficulty: "medium",
                catYear: "2024",
                solutionApproach: "S₄₀ - S₂₀ gives sum of terms 21-40"
            },
            {
                pattern: "GP with infinite series",
                example: "Find the sum to infinity: 1 + 1/3 + 1/9 + 1/27 + ...",
                difficulty: "easy",
                catYear: "2023",
                solutionApproach: "For |r| < 1, S∞ = a/(1-r)"
            }
        ]
    },

    numberSystem: {
        divisibility: [
            {
                pattern: "Remainder theorem problems",
                example: "What is the remainder when 7^103 is divided by 25?",
                difficulty: "hard",
                catYear: "2023",
                solutionApproach: "Find pattern in remainders: 7¹, 7², 7³... mod 25"
            },
            {
                pattern: "LCM-HCF word problems",
                example: "Two bells ring at intervals of 48 and 72 minutes. If they ring together at 11:00 AM, when will they ring together again?",
                difficulty: "easy",
                catYear: "2024",
                solutionApproach: "Time = LCM(48, 72) minutes"
            }
        ],

        factors: [
            {
                pattern: "Number of factors",
                example: "How many factors of 2⁴ × 3³ × 5² are perfect squares?",
                difficulty: "medium",
                catYear: "2022",
                solutionApproach: "For perfect squares, all prime powers must be even: (4/2 + 1)(3/2 + 1)(2/2 + 1)"
            }
        ]
    },

    geometry: {
        triangles: [
            {
                pattern: "Similar triangles and area ratio",
                example: "Two similar triangles have areas in the ratio 16:25. If the perimeter of the smaller triangle is 40 cm, find the perimeter of the larger triangle.",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "Area ratio = (side ratio)², Perimeter ratio = side ratio"
            }
        ],

        circles: [
            {
                pattern: "Inscribed/circumscribed circles",
                example: "A square is inscribed in a circle of radius 7 cm. Find the area of the square.",
                difficulty: "easy",
                catYear: "2024",
                solutionApproach: "Diagonal of square = diameter of circle"
            }
        ],

        mensuration: [
            {
                pattern: "Volume and surface area transformations",
                example: "If the radius of a cylinder is increased by 50% and height is decreased by 20%, what is the percentage change in volume?",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "New volume = πr² × 1.5² × h × 0.8, compare with original"
            }
        ]
    },

    modernMath: {
        permutationCombination: [
            {
                pattern: "Arrangements with restrictions",
                example: "In how many ways can 5 boys and 3 girls sit in a row such that no two girls sit together?",
                difficulty: "hard",
                catYear: "2022",
                solutionApproach: "Arrange boys first (5!), then place girls in gaps (⁶P₃)"
            },
            {
                pattern: "Selection with conditions",
                example: "From 6 gentlemen and 4 ladies, a committee of 5 is to be formed. In how many ways can this be done if at least 2 ladies must be included?",
                difficulty: "medium",
                catYear: "2023",
                solutionApproach: "2 ladies + 3 gents + 3 ladies + 2 gents + 4 ladies + 1 gent"
            }
        ],

        probability: [
            {
                pattern: "Independent events probability",
                example: "Two dice are thrown simultaneously. What is the probability that the sum is at least 10?",
                difficulty: "easy",
                catYear: "2024",
                solutionApproach: "Count favorable outcomes: (4,6), (5,5), (5,6), (6,4), (6,5), (6,6) = 6/36"
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
