import { ERROR_MESSAGES } from "../constants";
import { parseXml, transformOpml } from "../utils";

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
    const response = await fetch(input.toString());
    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.FETCH_FAILED);
    }
    xmlText = await response.text();
  } else if (typeof input === "string") {
    xmlText = input;
  } else {
    throw new Error(ERROR_MESSAGES.OPML_INVALID_INPUT);
  }

  if (!xmlText) {
    throw new Error(ERROR_MESSAGES.OPML_NO_FEED_TO_PARSE);
  }

  const parsedXML = parseXml(xmlText);
  const feeds = transformOpml(parsedXML);

  return feeds;
};
