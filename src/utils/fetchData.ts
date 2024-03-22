import { ERROR_MESSAGES } from "../constants";

/**
 * Fetches the content from the provided URL.
 * @param url The URL of the content.
 * @returns A promise that resolves to the text content of the response.
 */
export async function fetchData(url: URL): Promise<string> {
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.FETCH_FAILED);
  }
  return response.text();
}
