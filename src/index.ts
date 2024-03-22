import { fetchData } from "./utils/fetchData";
import { fetchItunes } from "./utils/fetchItunes";

import { Podcast, Episode, Itunes } from "./types";
import { parseXml, transformOpml, transformPodcast } from "./utils";
import { ERROR_MESSAGES } from "./constants";

/**
 * Parses a podcast feed from various input types and returns podcast and episodes data, along with iTunes information if available.
 *
 * @param input - A URL, iTunes ID, or XML string representing the podcast feed.
 * @returns An object containing the podcast and episodes data, along with iTunes information if available.
 * @throws {Error} If the input type is invalid, the feed URL cannot be retrieved from iTunes, or no feed is available to parse.
 */
export const podcastXmlParser = async (
  input: URL | number | string,
): Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: Itunes }> => {
  let xmlText: string = "";
  let itunes: Itunes | undefined;

  if (input instanceof URL) {
    xmlText = await fetchData(input);
  } else if (typeof input === "number") {
    itunes = await fetchItunes(input);
    if (!itunes?.feedUrl) {
      throw new Error(ERROR_MESSAGES.ITUNES_NO_FEED_URL);
    }
    xmlText = await fetchData(new URL(itunes.feedUrl));
  } else if (typeof input === "string") {
    xmlText = input;
  } else {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  if (!xmlText) {
    throw new Error(ERROR_MESSAGES.NO_FEED_TO_PARSE);
  }

  const parsedXML = parseXml(xmlText);
  const { podcast, episodes } = transformPodcast(parsedXML);

  if (!itunes && podcast.feedUrl) {
    itunes = await fetchItunes(podcast.title, podcast.feedUrl);
  }

  return { podcast, episodes, itunes };
};

/**
 * Parses an OPML feed and returns an array of podcast feed URLs.
 *
 * @param input - A URL or XML string representing the OPML feed.
 * @returns An array of feed URLs extracted from the OPML data.
 * @throws {Error} If the input type is invalid or no feed is available to parse.
 */
export const podcastOpmlParser = async (input: URL | string): Promise<string[]> => {
  let xmlText: string = "";

  if (input instanceof URL) {
    xmlText = await fetchData(input);
  } else if (typeof input === "string") {
    xmlText = input;
  } else {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  if (!xmlText) {
    throw new Error(ERROR_MESSAGES.NO_FEED_TO_PARSE);
  }

  const parsedXML = parseXml(xmlText);
  const feeds = transformOpml(parsedXML);

  return feeds;
};

export default podcastXmlParser;
