import dayjs from "dayjs"

/**
 * @param value 
 * @returns 
 */
export function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === "string" && value.replaceAll(" ", "").length === 0) return true
  return false
}

/**
 * Simple way extract plaintext from HTML
 * Best use for not very long HTML string
 * @param {string} str html string
 * @returns 
 */
export function removeHTMLTags(str: string): string {
	return str.replace(/<[^>]*>/g, "")
}

/**
 * Convert readable password to un-readable password
 * to keep in the database, if someone get this, he/she cannot use
 * @param {string} password
 * @returns 
 */
 export async function passwordHash(password: string): Promise<string> {
	const enc = new TextEncoder().encode(password)
	const hash = await crypto.subtle.digest({ name: "SHA-256" }, enc)
	const hashStr = new TextDecoder().decode(new Uint8Array(hash))
	return hashStr
}

/**
 * Determine whether the provided `date` is less than number of provided `days`.
 * @param {string} date 
 * @param {number} days 
 * @returns 
 */
export function isRecentlyUpdate(date: string, days: number): boolean {
	return (dayjs().diff(dayjs(date)) / 86_400_000) < days
}