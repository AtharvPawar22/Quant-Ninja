// Question bank for Quant Arcade games
export const questions = [
    // RATIOS
    {
        id: 1,
        category: 'RATIOS',
        question: 'A and B share money in the ratio 3:2. If A gets ₹600 more than B, what is the total amount shared?',
        options: ['₹3000', '₹2400', '₹1800', '₹3600'],
        answer: '₹3000',
        hint: 'Difference in ratio parts = ₹600',
        solution: 'Ratio = 3:2, Difference = 3-2 = 1 part = ₹600. Total parts = 5, so Total = 5 × 600 = ₹3000'
    },
    {
        id: 2,
        category: 'RATIOS',
        question: 'The ratio of boys to girls in a class is 4:5. If there are 36 students, how many are boys?',
        options: ['16', '18', '20', '15'],
        answer: '16',
        hint: 'Total parts = 4 + 5 = 9',
        solution: 'Total parts = 9, Each part = 36/9 = 4. Boys = 4 × 4 = 16'
    },
    {
        id: 3,
        category: 'RATIOS',
        question: 'A mixture contains milk and water in ratio 5:3. If 16 liters of mixture is there, how much milk is present?',
        options: ['10 L', '8 L', '6 L', '12 L'],
        answer: '10 L',
        hint: 'Find value of each part first',
        solution: 'Total parts = 8, Each part = 16/8 = 2L. Milk = 5 × 2 = 10L'
    },
    // COMBINATIONS
    {
        id: 4,
        category: 'COMBINATIONS',
        question: 'A committee of 3 is to be formed from 5 men and 3 women. How many ways if at least 1 woman is needed?',
        options: ['46', '45', '36', '56'],
        answer: '46',
        hint: 'Total ways - All men',
        solution: 'Total ways = C(8,3) = 56. All men = C(5,3) = 10. At least 1 woman = 56 - 10 = 46'
    },
    {
        id: 5,
        category: 'COMBINATIONS',
        question: 'In how many ways can 5 distinct books be arranged on a shelf?',
        options: ['120', '60', '25', '720'],
        answer: '120',
        hint: 'Arrangement = n!',
        solution: '5! = 5 × 4 × 3 × 2 × 1 = 120'
    },
    {
        id: 6,
        category: 'COMBINATIONS',
        question: 'How many ways to choose 2 items from 6 distinct items?',
        options: ['15', '12', '30', '36'],
        answer: '15',
        hint: 'C(n,r) = n! / (r! × (n-r)!)',
        solution: 'C(6,2) = 6!/(2! × 4!) = (6×5)/(2×1) = 15'
    },
    // PERCENTAGES
    {
        id: 7,
        category: 'PERCENTAGES',
        question: 'A price increases by 20% then decreases by 20%. What is the net change?',
        options: ['-4%', '0%', '-2%', '+4%'],
        answer: '-4%',
        hint: 'Successive percentage formula',
        solution: 'Net = 20 - 20 - (20×20)/100 = -4%'
    },
    {
        id: 8,
        category: 'PERCENTAGES',
        question: 'If 60% of a number is 42, what is the number?',
        options: ['70', '65', '75', '80'],
        answer: '70',
        hint: '60% = 42, find 100%',
        solution: '60% = 42, so 1% = 42/60 = 0.7. 100% = 70'
    },
    {
        id: 9,
        category: 'PERCENTAGES',
        question: 'A shopkeeper marks up by 50% and gives 20% discount. What is the profit %?',
        options: ['20%', '25%', '30%', '15%'],
        answer: '20%',
        hint: 'SP = MP × (1 - discount%)',
        solution: 'Let CP = 100. MP = 150. SP = 150 × 0.8 = 120. Profit = 20%'
    },
    // TIME & WORK
    {
        id: 10,
        category: 'TIME & WORK',
        question: 'A can do a work in 10 days, B in 15 days. Together, how many days?',
        options: ['6', '5', '8', '7'],
        answer: '6',
        hint: 'Add their daily work rates',
        solution: 'A rate = 1/10, B rate = 1/15. Combined = 1/10 + 1/15 = 5/30 = 1/6. Days = 6'
    },
    {
        id: 11,
        category: 'TIME & WORK',
        question: 'If 5 men can do a work in 12 days, how many days for 6 men?',
        options: ['10', '8', '9', '11'],
        answer: '10',
        hint: 'Man-days remain constant',
        solution: 'Man-days = 5 × 12 = 60. For 6 men = 60/6 = 10 days'
    },
    // PROFIT & LOSS
    {
        id: 12,
        category: 'PROFIT & LOSS',
        question: 'An article bought for ₹800 is sold for ₹920. What is the profit percentage?',
        options: ['15%', '12%', '18%', '20%'],
        answer: '15%',
        hint: 'Profit % = (Profit/CP) × 100',
        solution: 'Profit = 920 - 800 = 120. Profit % = (120/800) × 100 = 15%'
    },
    {
        id: 13,
        category: 'PROFIT & LOSS',
        question: 'Selling price is ₹450 with 10% loss. What was the cost price?',
        options: ['₹500', '₹480', '₹520', '₹490'],
        answer: '₹500',
        hint: 'SP = CP × (1 - Loss%)',
        solution: '450 = CP × 0.9, so CP = 450/0.9 = ₹500'
    },
    // SIMPLE INTEREST
    {
        id: 14,
        category: 'INTEREST',
        question: 'Simple interest on ₹5000 at 8% for 3 years is?',
        options: ['₹1200', '₹1000', '₹1400', '₹1100'],
        answer: '₹1200',
        hint: 'SI = PRT/100',
        solution: 'SI = (5000 × 8 × 3)/100 = ₹1200'
    },
    {
        id: 15,
        category: 'INTEREST',
        question: 'At what rate will ₹2000 become ₹2200 in 2 years (simple interest)?',
        options: ['5%', '8%', '10%', '6%'],
        answer: '5%',
        hint: 'Rate = (SI × 100)/(P × T)',
        solution: 'SI = 200. Rate = (200 × 100)/(2000 × 2) = 5%'
    },
    // SPEED & DISTANCE
    {
        id: 16,
        category: 'SPEED',
        question: 'A train 200m long passes a pole in 20 seconds. What is its speed in km/hr?',
        options: ['36 km/hr', '40 km/hr', '30 km/hr', '45 km/hr'],
        answer: '36 km/hr',
        hint: 'Speed = Distance/Time, then convert m/s to km/hr',
        solution: 'Speed = 200/20 = 10 m/s = 10 × 18/5 = 36 km/hr'
    },
    {
        id: 17,
        category: 'SPEED',
        question: 'A car travels 240 km in 4 hours. How long to travel 360 km at same speed?',
        options: ['6 hours', '5 hours', '7 hours', '8 hours'],
        answer: '6 hours',
        hint: 'First find speed',
        solution: 'Speed = 240/4 = 60 km/hr. Time = 360/60 = 6 hours'
    },
    // AVERAGES
    {
        id: 18,
        category: 'AVERAGES',
        question: 'Average of 5 numbers is 20. If one number is removed, average becomes 18. What was removed?',
        options: ['28', '24', '30', '26'],
        answer: '28',
        hint: 'Find total before and after',
        solution: 'Original sum = 5×20 = 100. New sum = 4×18 = 72. Removed = 100-72 = 28'
    },
    {
        id: 19,
        category: 'AVERAGES',
        question: 'Average age of 4 friends is 25. A 5th friend joins making average 26. Age of 5th friend?',
        options: ['30', '28', '32', '35'],
        answer: '30',
        hint: 'New total - Old total',
        solution: 'Old sum = 4×25 = 100. New sum = 5×26 = 130. 5th friend = 130-100 = 30'
    },
    // ALGEBRA
    {
        id: 20,
        category: 'ALGEBRA',
        question: 'If x + y = 10 and xy = 21, what is x² + y²?',
        options: ['58', '52', '48', '62'],
        answer: '58',
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
