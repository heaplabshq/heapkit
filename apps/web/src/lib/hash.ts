import { md5 } from './md5'

export const HASH_ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const
export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number]

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function computeHash(algorithm: HashAlgorithm, text: string): Promise<string> {
  if (algorithm === 'MD5') return md5(text)
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest(algorithm, bytes)
  return bufferToHex(digest)
}
