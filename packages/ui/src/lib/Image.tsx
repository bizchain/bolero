import * as React from "react"

/**
 * Load image based on the screen size, great way to optimize the site's performance
 * Now to support 2 variants: 1 for mobile, 1 for the rest
 * 	- mobile is max-width 768px
 * 	- desktop is min-with 769px
 * @returns 
 */
export function Image({ mobile, desktop, alt, className, loading, fallback }: {
	mobile: string
	desktop: string
	alt?: string
	className?: string
	loading?: "lazy" | "eager"
	fallback?: "mobile" | "desktop"
}) {
	return (
		<picture>
			<source media="(max-width: 768px)" srcSet={mobile}/>
			<source media="(min-width: 769px)" srcSet={desktop} />
			<img src={fallback === "mobile" ? mobile : desktop} alt={alt ?? ""} className={className ?? ""} loading={loading}/>
		</picture>
	)
}