import type {
  BlockObjectResponse,
  CreatePageResponse,
  GetBlockResponse,
  GetPageResponse,
  ListBlockChildrenResponse,
  PropertyValueCheckbox,
  PropertyValueDate,
  PropertyValueEmail,
  PropertyValueMultiSelect,
  PropertyValueNumber,
  PropertyValuePhoneNumber,
  PropertyValueRichText,
  PropertyValueSelect,
  PropertyValueTitle,
  PropertyValueUrl,
  QueryDatabaseResponse,
  UpdateBlockResponse,
  UpdatePageResponse
} from "./notion-type"

type TApiHeaders = {
  "Authorization": string
  "Notion-Version": string
  "Content-Type": string
}

const baseURL = "https://api.notion.com/v1"

/**
 * 
 * @param NOTION_API_KEY 
 * @param NOTION_VERSION 
 * @returns 
 */
export function apiHeaders(NOTION_API_KEY: string, NOTION_VERSION = "2022-02-22") {
  return <TApiHeaders>{
    "Authorization": `Bearer ${NOTION_API_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
  }
}

/**
 * 
 * @param headers 
 * @param databaseId 
 * @param body 
 * @returns 
 * 
 * Docs:
 * - https://developers.notion.com/reference/post-database-query
 */
export async function queryDatabase(headers: TApiHeaders, databaseId: string, body?: string): Promise<QueryDatabaseResponse> {
  const response = await fetch(`${baseURL}/databases/${databaseId}/query`, {
    method: "POST",
    headers: headers,
    body: body ?? ""
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`queryDatabase: ${res?.message}`)

  return res as QueryDatabaseResponse
}

/**
 * 
 * @param headers 
 * @param databaseId 
 * @param body 
 * @returns 
 * 
 * Docs:
 * - https://api.notion.com/v1/pages
 * - https://developers.notion.com/reference/post-page
 */
export async function createPage(headers: TApiHeaders, databaseId: string, body: string): Promise<CreatePageResponse> {
  const response = await fetch(`${baseURL}/pages`, {
    method: "POST",
    headers: headers,
    body
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`createPage: ${res?.message}`)

  return res as CreatePageResponse
}

/**
 * Get page properties, not its content
 * @param headers 
 * @param pageId 
 * @returns 
 * 
 * Docs:
 * - https://developers.notion.com/reference/retrieve-a-page
 */
export async function getPage(headers: TApiHeaders, pageId: string): Promise<GetPageResponse> {
  const response = await fetch(`${baseURL}/pages/${pageId}`, {
    method: "GET",
    headers: headers
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`getPageContent: ${res?.message}`)

  return res as GetPageResponse
}

/**
 * 
 * @param headers 
 * @param pageId 
 * @param body 
 * @returns 
 * 
 * Docs:
 * - https://developers.notion.com/reference/patch-page
 */
export async function updatePageProperties(headers: TApiHeaders, pageId: string, body: string): Promise<UpdatePageResponse> {
  const response = await fetch(`${baseURL}/pages/${pageId}`, {
    method: "PATCH",
    headers: headers,
    body
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`updatePageProperties: ${res?.message}`)

  return res as UpdatePageResponse
}

/**
 * 
 * @param headers 
 * @param pageId 
 * @returns 
 * 
 * Docs:
 * - https://developers.notion.com/reference/get-block-children
 */
export async function getPageContent(headers: TApiHeaders, pageId: string): Promise<ListBlockChildrenResponse> {
  const response = await fetch(`${baseURL}/blocks/${pageId}/children`, {
    method: "GET",
    headers: headers
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`getPageContent: ${res?.message}`)

  return res as ListBlockChildrenResponse
}

/**
 * 
 * @param headers 
 * @param blockId 
 * @returns 
 * 
 * Docs:
 * - https://developers.notion.com/reference/retrieve-a-block
 */
export async function getBlock(headers: TApiHeaders, blockId: string): Promise<GetBlockResponse> {
  const response = await fetch(`${baseURL}/blocks/${blockId}`, {
    method: "GET",
    headers: headers
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`getBlockContent: ${res?.message}`)

  return res as GetBlockResponse
}

/**
 * 
 * @param headers 
 * @param pageId 
 * @param body 
 * @returns 
 * 
 * Docs:
 * - https://developers.notion.com/reference/update-a-block
 */
export async function addBlocks(headers: TApiHeaders, pageId: string, body: string): Promise<BlockObjectResponse[]> {
  const response = await fetch(`${baseURL}/blocks/${pageId}/children`, {
    method: "PATCH",
    headers: headers,
    body: body
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`setPageContent: ${res?.message}`)

  return (res as ListBlockChildrenResponse).results
}

/**
 * 
 * @param headers 
 * @param blockId 
 * @param body 
 * @returns 
 * 
 * Docs:
 * - https://developers.notion.com/reference/update-a-block
 */
export async function updateBlock(headers: TApiHeaders, blockId: string, body: string): Promise<UpdateBlockResponse> {
  const response = await fetch(`${baseURL}/blocks/${blockId}`, {
    method: "PATCH",
    headers: headers,
    body: body
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`updateBlock: ${res?.message}`)

  return res as UpdateBlockResponse
}

/**
 * Delete one or more blocks
 * @param headers 
 * @param blockIds 
 * @returns 
 * 
 * Docs:
 * - https://developers.notion.com/reference/delete-a-block
 */
export async function deleteBlocks(headers: TApiHeaders, blockIds: string[]) {
  const deletedBlocks = await Promise.all(blockIds.map(blockId => (
    fetch(`${baseURL}/blocks/${blockId}`, {
      method: "DELETE",
      headers: headers
    }))))

  return deletedBlocks
}

/**
 * 
 * @param texts 
 * @returns 
 */
export function newPlainTextBlocks(texts: string[]) {
  const content = {
    "children": texts.map(text => ({
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": text,
              "link": null
            }
          }
        ]
      }
    }))
  }
  return JSON.stringify(content)
}

// export async function addParagraphBlocks(headers: TApiHeaders, pageId: string, chunks: string[]): Promise<BlockObjectResponse[]> {
//   const content = JSON.stringify({
//     "children": chunks.map(chunk => ({
//       "object": "block",
//       "type": "paragraph",
//       "paragraph": {
//         "rich_text": [
//           {
//             "type": "text",
//             "text": {
//               "content": chunk,
//               "link": null
//             }
//           }
//         ]
//       }
//     }))
//   })
//   const response = await addBlocks(headers, pageId, content)
//   return response
// }

/**
 * 
 * @param text 
 * @returns 
 */
export function updatePlainTextBlock(text: string) {
  const content = {
    "paragraph": {
      "rich_text": [
        { "text": { "content": text } }
      ]
    }
  }
  return JSON.stringify(content)
}


// export async function updateParagraphBlock(headers: TApiHeaders, blockId: string, content: string): Promise<UpdateBlockResponse> {
//   /**
//    * https://developers.notion.com/reference/update-a-block
//    */
//   const body = JSON.stringify({
//     "paragraph": {
//       "rich_text": [
//         { "text": { "content": content } }
//       ]
//     }
//   })
//   const updateRes = await updateBlock(headers, blockId, body)
//   return updateRes
// }

/**
 * Extract page property data
 */

/**
 * 
 * @param value 
 * @returns 
 */
export function getPageTitleValue(value: PropertyValueTitle): string {
  return value?.title[0]?.plain_text ?? ""
}

/**
 * 
 * @param value 
 * @returns 
 */
export function getParagraphPlainText(value: PropertyValueRichText): string {
  if (value === undefined) return ""
  return value.rich_text.reduce((all, current) => {
    return all.concat((all.length ? " " : "") + current.plain_text)
  }, "")

}

/**
 * 
 * @param value 
 * @returns 
 */
export function getSelectValue(value: PropertyValueSelect): string | undefined {
  return value?.select?.name
}

/**
 * 
 * @param value 
 * @returns 
 */
export function getMultiSelectValue(value: PropertyValueMultiSelect): string[] {
  if (value === undefined) return []
  return value.multi_select.map(item => item.name)
}

/**
 * 
 * @param value 
 * @returns 
 */
export function getEmailValue(value: PropertyValueEmail): string {
  return value?.email ?? ""
}

/**
 * 
 * @param value 
 * @returns 
 */
export function getPhoneValue(value: PropertyValuePhoneNumber): string {
  return value?.phone_number ?? ""
}

/**
 * 
 * @param value 
 * @returns 
 */
export function getCheckboxValue(value: PropertyValueCheckbox): boolean | undefined {
  return value?.checkbox
}

/**
 * 
 * @param value 
 * @returns 
 */
export function getDateValue(value: PropertyValueDate): string {
  return value?.date?.start ?? ""
}

/**
 * 
 * @param value 
 * @returns 
 */
export function getNumberValue(value: PropertyValueNumber): number | undefined {
  return value?.number ?? undefined
}

/**
 * 
 * @param value 
 * @returns 
 */
export function getUrlValue(value: PropertyValueUrl): string {
  return value?.url ?? ""
}

/**
 * 
 * @param value 
 * @returns 
 */
export function queryTitle(value: string) {
  return {
    "title": [{ "text": { "content": value } }]
  }
}

/**
 * 
 * @param value 
 * @returns 
 */
export function queryRichtext(value: string) {
  return {
    "rich_text": [{ "text": { "content": value } }]
  }
}

/**
 * 
 * @param value 
 * @returns 
 */
export function querySelect(value: string) {
  return {
    "select": { "name": value }
  }
}

/**
 * 
 * @param value 
 * @returns 
 */
export function queryNumber(value: number) {
  return {
    "number": value
  }
}

/**
 * 
 * @param value 
 * @returns 
 */
export function queryEmail(value: string) {
  return {
    "email": value
  }
}

/**
 * 
 * @param value 
 * @returns 
 */
export function queryCheckbox(value: boolean) {
  return {
    "checkbox": value
  }
}

/**
 * 
 * @param value 
 * @returns 
 */
export function queryPhoneNumber(value: string) {
  return {
    "phone_number": value
  }
}

/**
 * 
 * @param value value in format "28-11-1986" (day-month-year)
 * @returns 
 */
export function querySingleDate(value: string) {
  return {
    "date": {
      "start": value 
    }
  }
}

/**
 * 
 * @param param0 
 * @returns 
 */
export function filterRichtext({ propertyName, condition, content, timestamp, direction }: {
  propertyName: string
  condition: "equals" | "does_not_equal" | "contains" | "does_not_contain" | "starts_with" | "ends_with" | "is_empty" | "is_not_empty"
  content: string
  timestamp?: "created_time" | "last_edited_time"
  direction?: "descending" | "ascending"
}) {
  const queryObj: { [key: string]: any } = {}

  queryObj["filter"] = {
    "property": propertyName,
    "rich_text": { [condition]: content }
  }

  if (timestamp && direction) {
    queryObj["sorts"] = [
      {
        "timestamp": timestamp,
        "direction": direction
      }
    ]
  }

  return JSON.stringify(queryObj)
}