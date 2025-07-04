import type { Drug } from "./types"
import { config } from "./config"
import { logger } from "./logger"

const API_URL = config.api.url

interface FetchDrugsParams {
  name?: string
  category?: string
  ingredient?: string
  created_after?: string
  created_before?: string
  skip?: number
  limit?: number
}

async function handleApiResponse(response: Response) {
  logger.apiResponse(response.url, response.status)

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`

    try {
      const error = await response.json()
      errorMessage = error.detail || errorMessage
      logger.error("API Error Response", new Error(errorMessage), { status: response.status, url: response.url })
    } catch {
      logger.error("API Error Response Parse Failed", new Error(errorMessage), { status: response.status, url: response.url })
    }

    throw new Error(errorMessage)
  }

  // For DELETE requests, there might be no content
  if (response.status === 204) {
    return null
  }

  // Check if response has content before trying to parse JSON
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  // If no JSON content, return null
  return null
}

async function makeApiRequest(url: string, options?: RequestInit) {
  try {
    logger.apiRequest(url, options?.method || "GET", options?.body)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout)

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)
    return await handleApiResponse(response)
  } catch (error) {
    logger.apiError(url, error as Error)

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Unable to connect to the API server. Please ensure the backend is running.")
    }
    throw error
  }
}

export async function fetchDrugs(params: FetchDrugsParams): Promise<Drug[]> {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString())
    }
  })

  return makeApiRequest(`${API_URL}/drugs?${searchParams.toString()}`)
}

export async function fetchDrug(id: string): Promise<Drug> {
  return makeApiRequest(`${API_URL}/drugs/${id}`)
}

export async function fetchCategories(): Promise<string[]> {
  return makeApiRequest(`${API_URL}/categories`)
}

export async function createDrug(drugData: Partial<Drug>): Promise<Drug> {
  const response = await makeApiRequest(`${API_URL}/drugs`, {
    method: "POST",
    body: JSON.stringify(drugData),
  })

  return response
}

export async function updateDrug(id: string, drugData: Partial<Drug>): Promise<Drug> {
  return makeApiRequest(`${API_URL}/drugs/${id}`, {
    method: "PUT",
    body: JSON.stringify(drugData),
  })
}

export async function deleteDrug(id: string): Promise<void> {
  logger.info("Deleting drug", { drugId: id })

  await makeApiRequest(`${API_URL}/drugs/${id}`, {
    method: "DELETE",
  })

  logger.info("Drug deleted successfully", { drugId: id })
}

// Check if API is available
export async function checkApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}
