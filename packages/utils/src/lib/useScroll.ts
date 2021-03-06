import * as React from "react"
import { throttle } from "lodash"

/**
 * Whether current position of scrollY has been greater than a supplied position
 * @param pos 
 * @returns 
 */
export function useScrollOver(pos: number) {
	const [scrollOvered, setScrollOvered] = React.useState(false)

	React.useEffect(() => {
		const handleSetScrolledOver = () => {
			if (window.scrollY > pos) {
				if (!scrollOvered) setScrollOvered(true)	//the if statement here is to only update if necessary
			} else {
				if (scrollOvered) setScrollOvered(false)	//the if statement here is to only update if necessary
			}
		}
		window.addEventListener("scroll", handleSetScrolledOver)
		return () => window.removeEventListener("scroll", handleSetScrolledOver)
	}, [scrollOvered, pos])

	return scrollOvered
}

/**
 * Whether user is going down
 * @param _minY the minimum distant before starting checking. Default is 0 for to check immediately
 * @returns 
 */
export function useScrollDown(_minY?: number) {
	const [scrolling, setScrolling] = React.useState({
		isGoingDown: false,
		isOnTop: true,
	})
	const savedScrollY = React.useRef(0)
	const minY = _minY ?? 0

	React.useEffect(() => {

		const checker = throttle(() => {
			const currentPos = window.scrollY

			const newState = {
				isGoingDown:
					(currentPos > savedScrollY.current && currentPos > minY)
						? true
						: false,
				isOnTop:
					(currentPos <= minY || currentPos < 90)
						? true
						: false
			}

			if ((newState.isGoingDown !== scrolling.isGoingDown) || (newState.isOnTop !== scrolling.isOnTop))
				setScrolling(newState)
				
			savedScrollY.current = currentPos
		}, 400)

		window.addEventListener("scroll", checker)

		return () => window.removeEventListener("scroll", checker)

	}, [minY, scrolling.isGoingDown, scrolling.isOnTop])

	return scrolling
}