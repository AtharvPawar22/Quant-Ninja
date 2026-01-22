// Question bank for Quant Arcade games
export const questions = [
    // RATIOS
    {
        id: 1,
        category: 'ARITHMETIC',
        subTopic: 'ratios',
        format: 'MCQ',
        difficulty: 'beginner',
        patternId: 'arithm-ratio-basic',
        question: 'A and B share money in the ratio 3:2. If A gets ₹600 more than B, what is the total amount shared?',
        options: ['₹3000', '₹2400', '₹1800', '₹3600'],
        answer: '₹3000',
        hint: 'Difference in ratio parts = ₹600',
        solution: 'Ratio = 3:2, Difference = 3-2 = 1 part = ₹600. Total parts = 5, so Total = 5 × 600 = ₹3000'
    },
    {
        id: 2,
        category: 'ARITHMETIC',
        subTopic: 'ratios',
        format: 'TITA',
        difficulty: 'intermediate',
        patternId: 'arithm-ratio-triple',
        question: 'A sum of money is divided among A, B and C in ratio 2:3:5. If C gets ₹3000 more than A, find the total sum.',
        answer: 5000,
        hint: 'C-A = 5x - 2x = 3x = 3000',
        solution: '3x = 3000 => x = 1000. Total = (2+3+5)x = 10x = 10000. Wait, C-A is 3 parts. 10000.'
    },
    // COMBINATIONS
    {
        id: 4,
        category: 'NUMBER_SYSTEM',
        subTopic: 'counting',
        format: 'MCQ',
        difficulty: 'intermediate',
        patternId: 'modern-pc-selection',
        question: 'A committee of 3 is to be formed from 5 men and 3 women. How many ways if at least 1 woman is needed?',
        options: ['46', '45', '36', '56'],
        answer: '46',
        hint: 'Total ways - All men',
        solution: 'Total ways = C(8,3) = 56. All men = C(5,3) = 10. At least 1 woman = 56 - 10 = 46'
    },
    {
        id: 5,
        category: 'NUMBER_SYSTEM',
        subTopic: 'counting',
        format: 'TITA',
        difficulty: 'beginner',
        patternId: 'pc-linear-arr',
        question: 'In how many ways can 5 distinct books be arranged on a shelf?',
        answer: 120,
        hint: 'Arrangement = n!',
        solution: '5! = 5 × 4 × 3 × 2 × 1 = 120'
    },
    // PERCENTAGES
    {
        id: 7,
        category: 'ARITHMETIC',
        subTopic: 'percentages',
        format: 'MCQ',
        difficulty: 'beginner',
        patternId: 'arithm-perc-successive',
        question: 'A price increases by 20% then decreases by 20%. What is the net change?',
        options: ['-4%', '0%', '-2%', '+4%'],
        answer: '-4%',
        hint: 'Successive percentage formula',
        solution: 'Net = 20 - 20 - (20×20)/100 = -4%'
    },
    // TIME & WORK
    {
        id: 10,
        category: 'ARITHMETIC',
        subTopic: 'timeWork',
        format: 'MCQ',
        difficulty: 'beginner',
        patternId: 'work-together',
        question: 'A can do a work in 10 days, B in 15 days. Together, how many days?',
        options: ['6', '5', '8', '7'],
        answer: '6',
        hint: 'Add their daily work rates',
        solution: 'A rate = 1/10, B rate = 1/15. Combined = 1/10 + 1/15 = 5/30 = 1/6. Days = 6'
    },
    // SPEED & DISTANCE
    {
        id: 16,
        category: 'ARITHMETIC',
        subTopic: 'timeSpeed',
        format: 'MCQ',
        difficulty: 'beginner',
        patternId: 'tsd-train-pole',
        question: 'A train 200m long passes a pole in 20 seconds. What is its speed in km/hr?',
        options: ['36 km/hr', '40 km/hr', '30 km/hr', '45 km/hr'],
        answer: '36 km/hr',
        hint: 'Speed = Distance/Time, then convert m/s to km/hr',
        solution: 'Speed = 200/20 = 10 m/s = 10 × 18/5 = 36 km/hr'
    },
    // ALGEBRA
    {
        id: 20,
        category: 'ALGEBRA',
        subTopic: 'equations',
        format: 'TITA',
        difficulty: 'intermediate',
        patternId: 'alg-quad-sum-prod',
        question: 'If x + y = 10 and xy = 21, what is the value of x² + y²?',
        answer: 58,
        hint: '(x+y)² = x² + 2xy + y²',
        solution: 'x² + y² = (x+y)² - 2xy = 100 - 42 = 58'
    }
];

// Simple math questions for Challenge Friend mode (quick mental math)
export const simpleMathQuestions = [
    { id: 1, question: '15 × 8 = ?', options: ['120', '115', '125', '110'], answer: '120' },
    { id: 2, question: '144 ÷ 12 = ?', options: ['12', '11', '13', '14'], answer: '12' },
    { id: 3, question: '25² = ?', options: ['625', '525', '575', '650'], answer: '625' },
    { id: 4, question: '√196 = ?', options: ['14', '13', '15', '16'], answer: '14' },
    { id: 5, question: '17 + 28 + 35 = ?', options: ['80', '75', '85', '70'], answer: '80' },
    { id: 6, question: '1000 - 347 = ?', options: ['653', '663', '643', '657'], answer: '653' },
    { id: 7, question: '12 × 15 = ?', options: ['180', '170', '190', '175'], answer: '180' },
    { id: 8, question: '225 ÷ 15 = ?', options: ['15', '14', '16', '17'], answer: '15' },
    { id: 9, question: '18² = ?', options: ['324', '314', '334', '304'], answer: '324' },
    { id: 10, question: '√289 = ?', options: ['17', '16', '18', '19'], answer: '17' },
    { id: 11, question: '45 + 67 + 88 = ?', options: ['200', '190', '210', '195'], answer: '200' },
    { id: 12, question: '500 - 168 = ?', options: ['332', '322', '342', '312'], answer: '332' },
    { id: 13, question: '24 × 6 = ?', options: ['144', '134', '154', '148'], answer: '144' },
    { id: 14, question: '256 ÷ 16 = ?', options: ['16', '15', '17', '14'], answer: '16' },
    { id: 15, question: '13² = ?', options: ['169', '159', '179', '149'], answer: '169' },
];

// Utility to get random questions
export const getRandomQuestions = (pool, count) => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};
