import { cleanCards, SET_LIMITS } from './sets'
import type { Card } from './vocab'

/**
 * Sharing without a server: a set is compressed into a short code that rides
 * in a link's #fragment. Fragments never reach a server, so the link carries
 * the whole set and nothing is uploaded anywhere.
 *
 *   code = "L1" + base64url(deflate(JSON))
 *
 * The "L1" prefix versions the format so a later change can still read old
 * links.
 */

const PREFIX = 'L1'
/** Refuse to inflate past this — a guard against decompression bombs. */
const MAX_JSON_BYTES = 256_000
const MAX_CODE_LENGTH = 40_000

export interface SharedSet {
  courseId: string
  name: string
  cards: Card[]
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(text: string): Uint8Array {
  const base64 = text.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
}

async function pipeThrough(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream,
  limit = Infinity,
): Promise<Uint8Array> {
  const writer = stream.writable.getWriter()
  // Errors surface on the read side; these would otherwise go unhandled.
  writer.write(bytes as Uint8Array<ArrayBuffer>).catch(() => {})
  writer.close().catch(() => {})

  const reader = stream.readable.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > limit) {
      await reader.cancel()
      throw new Error('Shared set is too large')
    }
    chunks.push(value)
  }

  const out = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}

export async function encodeSet(set: SharedSet): Promise<string> {
  // Short keys and card tuples keep the link as small as possible.
  const json = JSON.stringify({
    c: set.courseId,
    n: set.name,
    k: set.cards.map((card) => [card.front, card.back]),
  })
  const deflated = await pipeThrough(
    new TextEncoder().encode(json),
    new CompressionStream('deflate-raw'),
  )
  return PREFIX + toBase64Url(deflated)
}

/** Null for anything that isn't a well-formed, non-empty set. Never throws. */
export async function decodeSet(code: string): Promise<SharedSet | null> {
  try {
    if (!code.startsWith(PREFIX) || code.length > MAX_CODE_LENGTH) return null
    const inflated = await pipeThrough(
      fromBase64Url(code.slice(PREFIX.length)),
      new DecompressionStream('deflate-raw'),
      MAX_JSON_BYTES,
    )
    const data = JSON.parse(new TextDecoder().decode(inflated)) as Record<
      string,
      unknown
    >
    const name =
      typeof data.n === 'string' ? data.n.trim().slice(0, SET_LIMITS.name) : ''
    const courseId = typeof data.c === 'string' ? data.c.slice(0, 40) : ''
    const cards = cleanCards(data.k)
    return name && courseId && cards.length ? { courseId, name, cards } : null
  } catch {
    return null
  }
}

/** Accepts a whole share link or a bare code, as pasted by a friend. */
export function extractCode(input: string): string | null {
  const text = input.trim()
  const fromLink = text.match(/[#&]set=([A-Za-z0-9_-]+)/)
  if (fromLink) return fromLink[1]
  return /^L1[A-Za-z0-9_-]+$/.test(text) ? text : null
}

export function shareLink(code: string): string {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = `set=${code}`
  return url.toString()
}

/** A link on localhost only opens on this machine — worth telling the sharer. */
export function isLocalOnly(): boolean {
  return ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
}
