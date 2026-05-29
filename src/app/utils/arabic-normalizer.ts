export function normalizeArabic(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/[\u064B-\u065F\u0670]/g, '')  // strip diacritics (tashkeel)
    .replace(/[أإآٱ]/g, 'ا')                // normalize alef variants
    .replace(/ة/g, 'ه')                     // ta marbuta → ha
    .replace(/ى/g, 'ي');                    // alef maksura → ya
}
