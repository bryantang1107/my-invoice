/**
 * Tax relief category as per LHDN (YA 2025).
 * Receipt-claimable categories suitable for tracking in the app.
 */
export type TaxReliefCategory = {
  id: string;
  label: string;
  limitRm: number;
  description?: string;
};

/**
 * User's claimed amount per category (for progress display).
 */
export type TaxReliefSummary = {
  categoryId: string;
  claimedRm: number;
  limitRm: number;
};

/** LHDN receipt-claimable relief categories with YA 2025 limits. */
export const TAX_RELIEF_CATEGORIES: TaxReliefCategory[] = [
  { id: 'medical', label: 'Medical expenses', limitRm: 10_000, description: 'Serious illness, dental, mental health, vaccinations' },
  { id: 'medical_parents', label: 'Medical (parents)', limitRm: 8_000, description: 'Treatment, special needs, carer' },
  { id: 'education', label: 'Education fees', limitRm: 7_000, description: 'Self: degrees, diplomas, upskilling' },
  { id: 'sspn', label: 'SSPN (education savings)', limitRm: 8_000, description: 'National Education Savings Scheme' },
  { id: 'lifestyle', label: 'Lifestyle', limitRm: 2_500, description: 'Books, devices, internet subscription' },
  { id: 'sports', label: 'Sports', limitRm: 1_000, description: 'Gym, equipment, facility rental, competition fees' },
  { id: 'childcare', label: 'Childcare / kindergarten', limitRm: 3_000, description: 'Registered centres, child 6 and below' },
  { id: 'health_checks', label: 'Health checks', limitRm: 1_000, description: 'Full medical check-up, mental health, vaccinations' },
];

/** Dummy claimed amounts per category for dashboard progress bars. */
export const DUMMY_TAX_RELIEF_SUMMARY: TaxReliefSummary[] = [
  { categoryId: 'medical', claimedRm: 3_200, limitRm: 10_000 },
  { categoryId: 'medical_parents', claimedRm: 0, limitRm: 8_000 },
  { categoryId: 'education', claimedRm: 2_100, limitRm: 7_000 },
  { categoryId: 'sspn', claimedRm: 0, limitRm: 8_000 },
  { categoryId: 'lifestyle', claimedRm: 1_000, limitRm: 2_500 },
  { categoryId: 'sports', claimedRm: 600, limitRm: 1_000 },
  { categoryId: 'childcare', claimedRm: 0, limitRm: 3_000 },
  { categoryId: 'health_checks', claimedRm: 0, limitRm: 1_000 },
];
