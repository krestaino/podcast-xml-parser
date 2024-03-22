import { Itunes } from "../types/Itunes";

/**
 * Fetches the content of a podcast XML feed from the provided URL.
 * @param url The URL of the podcast XML feed.
 * @returns A promise that resolves to the text content of the feed.
 */
export async function fetchPodcastFeed(url: URL): Promise<string> {
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch podcast feed from ${url}: ${response.statusText}`);
  }
  return response.text();
}

/**
 * Fetches podcast data from iTunes using the provided iTunes ID or search term.
 * Optionally, matches the result with a provided feed URL.
 * @param input The iTunes ID (number) or search term (string) of the podcast.
 * @param feedUrl Optional feed URL to match with the search results.
 * @returns A promise that resolves to the podcast data.
 */
export async function fetchItunes(input: number | string, feedUrl?: string): Promise<Itunes> {
  const url =
    typeof input === "number"
      ? `https://itunes.apple.com/lookup?id=${input}&entity=podcast`
      : `https://itunes.apple.com/search?term=${encodeURIComponent(input)}&entity=podcast`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch iTunes data for ${input}: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    resultCount: number;
    results: Array<Itunes>;
  };

  if (data.resultCount === 0) {
    throw new Error(`No podcast found for ${input}`);
  }

  const matchingResult = data.results.find((result) => {
    const matchesId = typeof input === "number" ? result.collectionId === input : true;
    const matchesFeedUrl = feedUrl ? result.feedUrl === feedUrl : true;
    return matchesId && matchesFeedUrl;
  });

  if (!matchingResult) {
    throw new Error(`No matching podcast found for ${input}`);
  }

  return matchingResult;
}
