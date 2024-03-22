/**
 * Fetches the content of a podcast XML feed from the provided URL.
 * @param url The URL of the podcast XML feed.
 * @returns A promise that resolves to the text content of the feed.
 */
export async function fetchPodcastFeed(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch podcast feed from ${url}: ${response.statusText}`);
  }
  return response.text();
}
