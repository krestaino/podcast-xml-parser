import { ERROR_MESSAGES } from "./constants";

/**
 * Fetches the content of a podcast XML feed from the provided URL.
 * @param url The URL of the podcast XML feed.
 * @returns A promise that resolves to the text content of the feed.
 */
export async function fetchPodcastFeed(url: URL): Promise<string> {
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.FETCH_FAILED);
  }
  return response.text();
}
