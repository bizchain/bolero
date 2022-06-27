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

const cacheTime = {
	"1 minutes": 1 * 60,
	"5 minutes": 5 * 60,
	"15 minutes": 15 * 60,
	"30 minutes": 30 * 60,
	//3,600
	"1 hour": 3_600,
	"2 hours": 2 * 3_600,
	"3 hours": 3 * 3_600,
	//86,400
	"1 day": 86_400,
	"2 days": 2 * 86_400,
	"7 days": 7 * 86_400,
	"1 month": 30 * 86_400,
}

type TCacheTime = keyof typeof cacheTime

/**
 * Cache-Control presets
 *   max-age : browser cache
 *   s-maxage: CDN cache
 */
export function cacheControl({
	isPublic = true,
	browserCache = "2 hours",
	cdnCache = "7 days",
	staleWhileRevalidate = 60
}: {
	//default isPublic === true
	isPublic?: boolean
	//default browserCache === 2 hours
	browserCache?: TCacheTime
	//default cdnCache === 7 days
	cdnCache?: TCacheTime
	//default staleWhileRevalidate === 60
	staleWhileRevalidate?: number
}) {
	return isPublic
		? `public, max-age=${cacheTime[browserCache]}, s-maxage=${cacheTime[cdnCache]}, stale-while-revalidate=${staleWhileRevalidate}`
		: `max-age=${cacheTime[browserCache]}, s-maxage=${cacheTime[cdnCache]}, stale-while-revalidate=${staleWhileRevalidate}`
}