import type {
  BlockObjectResponse,
  CreatePageResponse,
  GetBlockResponse,
  GetPageResponse,
  ListBlockChildrenResponse,
  QueryDatabaseResponse,
  UpdateBlockResponse,
  UpdatePageResponse
} from "./notion.d"

type TApiHeaders = {
  "Authorization": string
  "Notion-Version": string
  "Content-Type": string
}

export function apiHeaders(NOTION_API_KEY: string, NOTION_VERSION = "2022-02-22") {
  return <TApiHeaders>{
    "Authorization": `Bearer ${NOTION_API_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
  }
}

/************************************************************************************************
 * 
 * 	DATABASE
 * 
 ************************************************************************************************/

export async function queryDatabase(headers: TApiHeaders, databaseId: string, body?: string): Promise<QueryDatabaseResponse> {
  /**
   * https://developers.notion.com/reference/post-database-query
   */
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: headers,
    body: body ?? ""
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`queryDatabase: ${res?.message}`)

  return res as QueryDatabaseResponse
}

/************************************************************************************************
 * 
 * PAGES
 * - create new user
 * - create new ticket
 * - create new ticket reply
 * - ....
 * 
 ************************************************************************************************/

export async function createPage(headers: TApiHeaders, databaseId: string, body: string): Promise<CreatePageResponse> {
  /**
   * https://api.notion.com/v1/pages
   * https://developers.notion.com/reference/post-page
   */
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: headers,
    body
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`createPage: ${res?.message}`)

  return res as CreatePageResponse
}

/**
 * get page properties, not its content
 */
export async function getPage(headers: TApiHeaders, pageId: string): Promise<GetPageResponse> {
  /**
   * https://developers.notion.com/reference/retrieve-a-page
   */
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "GET",
    headers: headers
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`getPageContent: ${res?.message}`)

  return res as GetPageResponse
}

export async function updatePageProperties(headers: TApiHeaders, pageId: string, body: string): Promise<UpdatePageResponse> {
  /**
   * https://developers.notion.com/reference/patch-page
   */
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: headers,
    body
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`updatePageProperties: ${res?.message}`)

  return res as UpdatePageResponse
}

export async function getPageContent(headers: TApiHeaders, pageId: string): Promise<ListBlockChildrenResponse> {
  /**
   * https://developers.notion.com/reference/get-block-children
   */
  const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    method: "GET",
    headers: headers
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`getPageContent: ${res?.message}`)

  return res as ListBlockChildrenResponse
}

/************************************************************************************************
 * 
 * 	BLOCKS
 * 
 ************************************************************************************************/

export async function getBlock(headers: TApiHeaders, blockId: string): Promise<GetBlockResponse> {
  /**
   * https://developers.notion.com/reference/retrieve-a-block
   */
  const response = await fetch(`https://api.notion.com/v1/blocks/${blockId}`, {
    method: "GET",
    headers: headers
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`getBlockContent: ${res?.message}`)

  return res as GetBlockResponse
}

export async function addBlocks(headers: TApiHeaders, pageId: string, body: string): Promise<BlockObjectResponse[]> {
  /**
   * https://developers.notion.com/reference/update-a-block
   */
  const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    method: "PATCH",
    headers: headers,
    body: body
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`setPageContent: ${res?.message}`)

  return (res as ListBlockChildrenResponse).results
}

export async function updateBlock(headers: TApiHeaders, blockId: string, body: string): Promise<UpdateBlockResponse> {
  /**
   * https://developers.notion.com/reference/update-a-block
   */
  const response = await fetch(`https://api.notion.com/v1/blocks/${blockId}`, {
    method: "PATCH",
    headers: headers,
    body: body
  })

  const res = await response.json()
  if (res?.object === "error") throw new Error(`updateBlock: ${res?.message}`)

  return res as UpdateBlockResponse
}

export async function addParagraphBlocks(headers: TApiHeaders, pageId: string, chunks: string[]): Promise<BlockObjectResponse[]> {
  const content = JSON.stringify({
    "children": chunks.map(chunk => ({
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": chunk,
              "link": null
            }
          }
        ]
      }
    }))
  })
  const response = await addBlocks(headers, pageId, content)
  return response
}

export async function updateParagraphBlock(headers: TApiHeaders, blockId: string, content: string): Promise<UpdateBlockResponse> {
  /**
   * https://developers.notion.com/reference/update-a-block
   */
  const body = JSON.stringify({
    "paragraph": {
      "rich_text": [
        { "text": { "content": content } }
      ]
    }
  })
  const updateRes = await updateBlock(headers, blockId, body)
  return updateRes
}

/**
 * Delete one or more blocks
 */
export async function deleteBlocks(headers: TApiHeaders, blockIds: string[]) {
  /**
  * https://developers.notion.com/reference/delete-a-block
  */

  const deletedBlocks = await Promise.all(blockIds.map(blockId => (
    fetch(`https://api.notion.com/v1/blocks/${blockId}`, {
      method: "DELETE",
      headers: headers
    }))))

  return deletedBlocks
}