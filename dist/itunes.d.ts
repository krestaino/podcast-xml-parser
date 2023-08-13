/**
 * Fetches podcast information from iTunes based on the provided podcast ID.
 *
 * @param id - The podcast ID for iTunes search.
 * @returns The search results for the podcast from iTunes or undefined on error.
 */
export declare function itunesLookup(id: number): Promise<any | undefined>;
