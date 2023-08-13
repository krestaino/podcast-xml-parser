import { type Podcast, type Episode, type Config } from "./types";
import { preprocessXml, retrieveXmlFromSource, parse } from "./xml";
import { createPodcast, createEpisode } from "./create";

export type { Podcast, Episode, Config };

/**
 * Parses a podcast's XML feed and returns structured data about the podcast and its episodes.
 * Supports optional iTunes integration to retrieve additional details.
 *
 * @param source - XML content, a URL pointing to the podcast feed, or an iTunes collectionId.
 * @param config - Configuration options for parsing, like pagination or iTunes integration.
 * @returns Parsed podcast data.
 * @throws Throws an error for invalid or empty XML feeds.
 */
export default async function podcastXmlParser(
  source: string | URL | number,
  config: Config = {},
): Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: any }> {
  let { itunes, xmlString } = await retrieveXmlFromSource(source, config);

  // Cleanup XML
  const preprocessedXml = preprocessXml(xmlString);

  // Parse XML
  const doc = parse(preprocessedXml);

  // Set podcast data
  const podcast = createPodcast(doc.documentElement);

  // Grab episodes from XML
  const episodeElements = Array.from(doc.getElementsByTagName("item"));

  // Optionally paginate episodes using config, otherwise use all episodes
  let { start = 0, limit } = config;
  start = typeof start === "number" && start > 0 ? start : 0;
  const end = start + (typeof limit === "number" && limit > 0 ? limit : episodeElements.length);
  const paginatedElements = episodeElements.slice(start, end);

  // Set episodes data
  const episodes = paginatedElements.map(createEpisode);

  // Optionally set itunes data
  if (config.itunes === true || itunes !== undefined) {
    // If already fetched itunes data in itunesLookup, skip the search and return the data directly
    if (itunes === undefined) {
      const itunesResponse = await fetch(`https://itunes.apple.com/search?term=${podcast.title}&entity=podcast`);
      itunes = await itunesResponse.json();
      // Set podcast if the feedUrl is equal on iTunes and in the XML
      itunes = itunes.results.find((result: any) => result.feedUrl === podcast.feedUrl);
    }

    // All done, return data
    return { itunes, podcast, episodes };
  }

  // All done, return data
  return { podcast, episodes };
}
