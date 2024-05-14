import { ERROR_MESSAGES } from "../constants";
import { transformOpml } from "../transform";

/**
 * Parses an OPML feed and returns an array of podcast feed URLs.
 *
 * @param source - A URL or XML string representing the OPML feed.
 * @returns An array of feed URLs extracted from the OPML data.
 * @throws If the source type is invalid or no feed is available to parse.
 */
export const podcastOpmlParser = async (source: URL | string): Promise<{ title?: string; url: string }[]> => {
  let xmlText: string = "";

  if (source instanceof URL) {
    const response = await fetch(source.toString());
    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.FETCH_FAILED);
    }
    xmlText = await response.text();
  } else if (typeof source === "string") {
    xmlText = source;
  } else {
    throw new Error(ERROR_MESSAGES.OPML_INVALID_SOURCE);
  }

  if (!xmlText) {
    throw new Error(ERROR_MESSAGES.OPML_NO_FEED_TO_PARSE);
  }

  return transformOpml(xmlText);
};
