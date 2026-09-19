/**
 * The contact form takes "WhatsApp or email" in one field. This reads which one it is, so a
 * typo is caught on the spot instead of becoming a lead nobody can reach. Shared by the form
 * and the API, so both judge the same way.
 */
export type Reach = { type: 'email'; value: string } | { type: 'phone'; value: string; wa: string };

// Arabic-Indic and Persian digits are what a Saudi phone keyboard may produce.
const toLatinDigits = (s: string) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

export function parseReach(input: string): Reach | null {
  const raw = toLatinDigits(input.trim());
  if (!raw) return null;

  if (raw.includes('@')) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw) ? { type: 'email', value: raw.toLowerCase() } : null;
  }

  // Phone: keep digits and a leading +; spaces, dashes and brackets are fine to type.
  if (/[^\d+\s\-().]/.test(raw)) return null;
  let digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) {
    // already international
  } else if (digits.startsWith('00')) digits = digits.slice(2);
  else if (/^05\d{8}$/.test(digits)) digits = `966${digits.slice(1)}`; // Saudi mobile, local form
  else if (/^5\d{8}$/.test(digits)) digits = `966${digits}`; // Saudi mobile without the 0
  // Anything else that starts with a single 0 is a local number we cannot message: a landline,
  // or a mobile with a digit missing or doubled. That is the typo this check exists to catch.
  else if (digits.startsWith('0')) return null;
  if (digits.length < 9 || digits.length > 15) return null;
  if (digits.startsWith('966') && !/^9665\d{8}$/.test(digits)) return null; // a Saudi number must be a valid mobile
  return { type: 'phone', value: `+${digits}`, wa: digits };
}
