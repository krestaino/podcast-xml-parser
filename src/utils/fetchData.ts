import { ERROR_MESSAGES } from "../constants";
import { Config } from "../types";

/**
 * Fetches the content from the provided URL.
 * @param url The URL of the content.
 * @param config Optional configuration object for fetch request.
 * @returns A promise that resolves to the text content of the response.
 */
export async function fetchData(url: URL, config?: Config): Promise<string> {
  const headers = new Headers(config?.requestHeaders);

  if (config?.requestSize) {
    headers.set("Range", `bytes=0-${config.requestSize}`);
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.FETCH_FAILED);
  }
  return response.text();
}
