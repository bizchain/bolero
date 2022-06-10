/**
 * sendmail.ts
 */

export type TEmailData = {
	sender: {
		name: string
		email: string
	},
	receiver: {
		name: string
		email: string
	},
	subject: string
	htmlBody: string
}

export type TMailJetConfig = {
	APIKEY_PUBLIC: string
	APIKEY_PRIVATE: string
}