function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4
  if (padding) base64 += '='.repeat(4 - padding)
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

type DecodedSection = { text: string; error: string | null }

export type DecodedJwt =
  | { valid: true; header: DecodedSection; payload: DecodedSection; claims: Record<string, unknown> | null; signature: string }
  | { valid: false; error: string }

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    return {
      valid: false,
      error: 'Not a valid JWT — expected 3 dot-separated segments (header.payload.signature).',
    }
  }
  const [headerPart, payloadPart, signaturePart] = parts

  const header = decodeSection(headerPart)
  const payload = decodeSection(payloadPart)

  let claims: Record<string, unknown> | null = null
  if (!payload.error) {
    try {
      claims = JSON.parse(base64UrlDecode(payloadPart))
    } catch {
      claims = null
    }
  }

  return { valid: true, header, payload, claims, signature: signaturePart }
}

function decodeSection(part: string): DecodedSection {
  try {
    return { text: JSON.stringify(JSON.parse(base64UrlDecode(part)), null, 2), error: null }
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Could not decode segment' }
  }
}

export function describeExpiry(claims: Record<string, unknown> | null): { text: string; expired: boolean } | null {
  if (!claims || typeof claims.exp !== 'number') return null
  const expired = claims.exp * 1000 < Date.now()
  const date = new Date(claims.exp * 1000).toLocaleString()
  return { text: expired ? `Expired ${date}` : `Valid until ${date}`, expired }
}
