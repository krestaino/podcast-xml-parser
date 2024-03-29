import { type Podcast, type Episode, type Itunes, type Config } from "./types";
export type { Podcast, Episode, Itunes, Config };
/**
 * Parses a podcast's XML feed and returns structured data about the podcast and its episodes.
 * Supports optional iTunes integration to retrieve additional details.
 *
 * @param source - XML content, a URL pointing to the podcast feed, or an iTunes collectionId.
 * @param config - Configuration options for parsing, like pagination or iTunes integration.
 * @returns Parsed podcast data.
 * @throws Throws an error for invalid or empty XML feeds.
 */
export default function podcastXmlParser(source: string | URL | number, config?: Config): Promise<{
    podcast: Podcast;
    episodes: Episode[];
    itunes?: any;
}>;
