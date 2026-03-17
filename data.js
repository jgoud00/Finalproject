const MAX_INCOME = 0xFF * 100;
const BASE_MERIT = 1e2;

export class Scholarship {
  constructor(id, name, amount, category, minMarks, maxIncome) {
    this.id        = id;
    this.name      = name;
    this.amount    = amount;
    this.category  = category;
    this.minMarks  = minMarks;
    this.maxIncome = maxIncome;
  }
}

export const scholarships = [
  new Scholarship(1, "National Merit Excellence Award",    75000, "merit",    85, 600000),
  new Scholarship(2, "Central Sector Scheme",              20000, "need",     80, 450000),
  new Scholarship(3, "Post-Matric Scholarship (SC/ST)",    30000, "minority", 50, 250000),
  new Scholarship(4, "Sports Excellence Fellowship",       50000, "sports",   60, 800000),
  new Scholarship(5, "Inspire Scholarship (SHE)",          80000, "merit",    90, 700000),
  new Scholarship(6, "OBC Pre-Matric Scholarship",         15000, "minority", 45, 300000),
  new Scholarship(7, "Prime Minister's Special Scholarship",60000,"need",     75, 350000),
  new Scholarship(8, "Pragati Scholarship for Girls",      50000, "need",     70, 800000),
];

export { MAX_INCOME, BASE_MERIT };