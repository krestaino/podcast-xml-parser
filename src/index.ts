import { fetchPodcastFeed } from "./fetch";
import { fetchItunes } from "./itunes";

import { parsePodcastXML } from "./xml";
import { transformPodcastData } from "./transform";
import { Itunes } from "./types/Itunes";
import { ERROR_MESSAGES } from "./constants";

/**
 * Parses a podcast feed from various input types and returns podcast and episodes data, along with iTunes information if available.
 *
 * @param input - A URL, iTunes ID, or XML string representing the podcast feed.
 * @returns An object containing the podcast and episodes data, along with iTunes information if available.
 * @throws {Error} If the input type is invalid, the feed URL cannot be retrieved from iTunes, or no feed is available to parse.
 */
const podcastXmlParser = async (input: URL | number | string) => {
  let xmlText: string = "";
  let itunes: Itunes | undefined;

  if (input instanceof URL) {
    xmlText = await fetchPodcastFeed(input);
  } else if (typeof input === "number") {
    itunes = await fetchItunes(input);
    if (!itunes?.feedUrl) {
      throw new Error(ERROR_MESSAGES.ITUNES_NO_FEED_URL);
    }
    xmlText = await fetchPodcastFeed(new URL(itunes.feedUrl));
  } else if (typeof input === "string") {
    xmlText = input;
  } else {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  if (!xmlText) {
    throw new Error(ERROR_MESSAGES.NO_FEED_TO_PARSE);
  }

  const parsedXML = parsePodcastXML(xmlText);
  const { podcast, episodes } = transformPodcastData(parsedXML);

  if (!itunes && podcast.feedUrl) {
    itunes = await fetchItunes(podcast.title, podcast.feedUrl);
  }

  return { podcast, episodes, itunes };
};

export default podcastXmlParser;
