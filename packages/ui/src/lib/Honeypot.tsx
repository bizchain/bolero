import * as React from "react"

/**
 * input control for `honeypot` strategy
 * - name is `username`
 * - default value is `empty string`
 * - className is `desse`
 */

/**
 * <input> control for `honeypot` strategy. Default name is `username`
 * @param param0 
 * @returns 
 */
export function Honeypot({ fieldName }: {fieldName: string}) {
	const name = fieldName ?? "username"
	return (
		<input
			type="text"
			name={name}
			placeholder={name}
			defaultValue=""
			className="desse"
		/>
	)
}