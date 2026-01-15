import { Hashing } from '@repo/types/enums';

const TRACKING_ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';

/**
 * Generates a short, user-readable tracking hash (e.g. 3 chars)
 */
const trackingHash = async (
  rawValue: string | number,
  length: number = 3,
  algorithm: Hashing = Hashing.SHA256
): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawValue.toString());

    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashBytes = new Uint8Array(hashBuffer);

    let result = '';

    for (let i = 0; i < length; i++) {
      result += TRACKING_ALPHABET[hashBytes[i] % TRACKING_ALPHABET.length];
    }

    return result;
  } catch (error) {
    console.error('---> utility error (tracking hash):', error);
    throw error;
  }
};

/**
 * Extracts initials from store title
 * "New York Central" → "NYC"
 */
export const storeTitleToCode = (title: string, length: number = 3): string => {
  const words = title
    .replace(/[^a-zA-Z ]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= length) {
    // New York Central → NYC
    return words
      .slice(0, length)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  if (words.length === 2) {
    // San Fernando → SFF
    return (words[0][0] + words[1][0] + words[1][0]).toUpperCase();
  }

  if (words.length === 1) {
    const word = words[0].toUpperCase();
    return word.length >= length
      ? word.slice(0, length)
      : word.padEnd(length, word[0]);
  }

  // Absolute fallback
  return 'GEN';
};

/**
 * YYMMDD
 */
const formatDate = (date: Date): string => {
  const yy = date.getFullYear().toString().slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
};

/**
 * Secure random Base32 using Web Crypto
 */
const randomSegment = (length = 4): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map((b) => TRACKING_ALPHABET[b % TRACKING_ALPHABET.length])
    .join('');
};

export const generateTrackingCode = async (params: {
  storeTitle: string;
  date: Date;
  deliveryType: string;
  hashInput: string;
}): Promise<string> => {
  const store = storeTitleToCode(params.storeTitle);
  const date = formatDate(params.date);
  const delivery = params.deliveryType[0].toUpperCase();

  const hash = await trackingHash(params.hashInput, 3);
  const random = randomSegment(4);

  return `${store}${date}${delivery}${hash}${random}`;
};
