/**
 * Shared webhook request handlers with timeout and error handling
 * Processes both scrape and blog creation requests with separate endpoints
 */

interface ScrapeWebhookPayload {
  type: "scrape"
  url: string
  maxPages?: number
}

interface BlogWebhookPayload {
  type: "blog"
  topic: string
  competitorBlog: string
}

interface NewBlogWebhookPayload {
  type: "newblog"
  topic: string
  additionalDetails: string
  research: boolean
}

interface WebhookResponse {
  markdown: string
}

export async function processScrapeWebhook(payload: ScrapeWebhookPayload): Promise<WebhookResponse> {
  // Validate webhook URL environment variable
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error("NEXT_PUBLIC_WEBHOOK_URL environment variable is not configured")
  }

  return await makeWebhookRequest(webhookUrl, payload)
}

export async function processBlogWebhook(payload: BlogWebhookPayload): Promise<WebhookResponse> {
  // Validate blog webhook URL environment variable
  const webhookUrl = process.env.NEXT_PUBLIC_BLOG_SUBMIT_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error("NEXT_PUBLIC_BLOG_SUBMIT_WEBHOOK_URL environment variable is not configured")
  }

  return await makeWebhookRequest(webhookUrl, payload)
}

export async function submitNewBlog(payload: Omit<NewBlogWebhookPayload, "type">): Promise<WebhookResponse> {
  // Validate new blog webhook URL environment variable
  const webhookUrl = process.env.NEXT_PUBLIC_NEW_BLOG_URL
  if (!webhookUrl) {
    throw new Error("NEXT_PUBLIC_NEW_BLOG_URL environment variable is not configured")
  }

  const fullPayload: NewBlogWebhookPayload = {
    type: "newblog",
    ...payload,
  }

  return await makeWebhookRequest(webhookUrl, fullPayload)
}

async function makeWebhookRequest(
  webhookUrl: string,
  payload: ScrapeWebhookPayload | BlogWebhookPayload | NewBlogWebhookPayload,
): Promise<WebhookResponse> {
  // Create AbortController for 90-second timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 120000)

  try {
    // Make POST request to webhook with proper headers
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`)
    }

    // Try to parse as JSON first, fallback to plain text
    let result: WebhookResponse
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      const jsonData = await response.json()
      result = { markdown: jsonData.markdown || jsonData }
    } else {
      // Fallback to plain text response
      const textData = await response.text()
      result = { markdown: textData }
    }

    return result
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out after 90 seconds. Please try again.")
      }
      throw error
    }

    throw new Error("An unexpected error occurred while processing the request")
  }
}

export async function processWebhook(
  payload: ScrapeWebhookPayload | BlogWebhookPayload | NewBlogWebhookPayload,
): Promise<WebhookResponse> {
  if (payload.type === "scrape") {
    return processScrapeWebhook(payload)
  } else if (payload.type === "blog") {
    return processBlogWebhook(payload)
  } else if (payload.type === "newblog") {
    return submitNewBlog(payload)
  } else {
    throw new Error("Unsupported webhook type")
  }
}
