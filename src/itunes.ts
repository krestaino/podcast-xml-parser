import { type Itunes } from "./types";

/**
 * Fetches podcast information from iTunes based on the provided podcast ID.
 *
 * @param id - The podcast ID for iTunes search.
 * @returns The search results for the podcast from iTunes or undefined on error.
 */
export async function itunesLookup(id: number): Promise<Itunes | undefined> {
  const itunesResponse = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=podcast`);
  const itunesData = await itunesResponse.json();
  return itunesData.results[0];
}
