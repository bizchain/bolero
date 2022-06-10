import { removeHTMLTags } from "./utils"
import type { TEmailData, TMailJetConfig } from "./utils-types"

const baseUrl = "https://api.mailjet.com/v3.1"

/**
 * Send email via MailJet services
 * @param emailData 
 * @param config 
 * @returns 
 */
export async function sendMailJet(emailData: TEmailData, config: TMailJetConfig): Promise<any> {
	const res = await fetch(`${baseUrl}/send`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + btoa(`${config.APIKEY_PUBLIC}:${config.APIKEY_PRIVATE}`)
		},
		body: JSON.stringify({
			"Messages": [
				{
					"From": {
						"Email": emailData.sender.email,
						"Name": emailData.sender.name
					},
					"To": [
						{
							"Email": emailData.receiver.email,
							"Name": emailData.receiver.name
						}
					],
					"Subject": emailData.subject,
					"TextPart": removeHTMLTags(emailData.htmlBody),
					"HTMLPart": emailData.htmlBody
				}
			]
		})
	})

	return res.json()
}