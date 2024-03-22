import { fetchData } from "./utils/fetchData";
import { parseXml, transformOpml } from "./utils";
import { ERROR_MESSAGES } from "./constants";

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
