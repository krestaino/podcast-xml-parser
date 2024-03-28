import { ERROR_MESSAGES } from "../constants";
import { Itunes } from "../types";

/**
 * Fetches podcast data from iTunes using the provided iTunes ID or search term.
 * Optionally, matches the result with a provided feed URL.
 * @param source - The iTunes ID (number) or search term (string) of the podcast.
 * @param feedUrl - Optional feed URL to match with the search results.
 * @returns A promise that resolves to the podcast data.
 */
export async function fetchItunes(source: number | string, feedUrl?: string): Promise<Itunes | undefined> {
  const url =
    typeof source === "number"
      ? `https://itunes.apple.com/lookup?id=${source}&entity=podcast`
      : `https://itunes.apple.com/search?term=${encodeURIComponent(source)}&entity=podcast`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.ITUNES_FETCH_FAILED);
  }

  const data = (await response.json()) as {
    resultCount: number;
    results: Array<Itunes>;
  };

  const matchingResult = data.results.find((result) => {
    const matchesId = typeof source === "number" ? result.collectionId === source : false;
    const matchesFeedUrl = feedUrl
      ? result.feedUrl &&
        result.feedUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") ===
          feedUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : false;
    return matchesId || matchesFeedUrl;
  });

  if (!matchingResult) {
    return undefined;
  }

  return matchingResult;
}
