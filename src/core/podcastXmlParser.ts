import { ERROR_MESSAGES } from "../constants";
import { Config, Podcast, Episode, Itunes } from "../types";
import { fetchItunes, fetchPodcast } from "../fetch";
import { transformPodcast } from "../transform";

/**
 * Parses a podcast feed from various source types and returns podcast and episodes data, along with iTunes information if available.
 *
 * @param source - A URL, iTunes ID, or XML string representing the podcast feed.
 * @returns An object containing the podcast and episodes data, along with iTunes information if available.
 * @throws {Error} If the source type is invalid, the feed URL cannot be retrieved from iTunes, or no feed is available to parse.
 */
export const podcastXmlParser = async (
  source: URL | number | string,
  config: Config = {},
): Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: Itunes }> => {
  let xmlText: string = "";
  let itunes: Itunes | undefined;

  if (source instanceof URL) {
    xmlText = await fetchPodcast(source, config);
  } else if (typeof source === "number") {
    itunes = await fetchItunes(source);
    if (!itunes?.feedUrl) {
      throw new Error(ERROR_MESSAGES.ITUNES_NO_FEED_URL);
    }
    xmlText = await fetchPodcast(new URL(itunes.feedUrl), config);
  } else if (typeof source === "string") {
    xmlText = source;
  } else {
    throw new Error(ERROR_MESSAGES.XML_INVALID_SOURCE);
  }

  if (!xmlText) {
    throw new Error(ERROR_MESSAGES.XML_NO_FEED_TO_PARSE);
  }

  const { podcast, episodes } = transformPodcast(xmlText);

  let paginatedEpisodes = episodes;
  if (config.start !== undefined && config.limit !== undefined) {
    paginatedEpisodes = episodes.slice(config.start, config.start + config.limit);
  }

  if (config.itunes && !itunes && podcast.feedUrl) {
    itunes = await fetchItunes(podcast.title, podcast.feedUrl);
  }

  return { podcast, episodes: paginatedEpisodes, itunes };
};
