import { DOMParser, XMLSerializer } from "xmldom";

import { type Config } from "./types";
import { itunesLookup } from "./itunes";
import { USER_AGENT } from "./constants";

const parser = new DOMParser();

/**
 * Removes all <item> elements from a cloned copy of the provided XML document.
 * This function is useful for processing podcast feeds where you want to
 * separate podcast metadata from individual episode information.
 *
 * @param originalDocument - The original XML document from which to remove <item> elements.
 * @returns A new XML document with all <item> elements removed.
 */
export function removeItemsFromDocument(originalDocument: Document): Document {
  // Clone the original document to avoid modifying it
  const document = originalDocument.cloneNode(true) as Document;

  // Convert the live NodeList to a static array
  const items = Array.from(document.getElementsByTagName("item"));

  // Remove each item from the document
  items.forEach((item) => {
    if (item.parentNode !== null) {
      item.parentNode.removeChild(item);
    }
  });

  return document;
}

/**
 * Trims XML feed by cutting off anything after the last complete <item>...</item> tag.
 *
 * @param feed - The XML feed to trim.
 * @returns The trimmed XML feed.
 */
function trimXmlFeed(feed: string): string {
  const lastCompleteItem = feed.lastIndexOf("</item>");
  if (lastCompleteItem !== -1) {
    // Cut off anything after the last complete item
    feed = feed.substring(0, lastCompleteItem + "</item>".length);
  }
  return feed + "</channel></rss>"; // Close the RSS feed to parse data
}

/**
 * Preprocesses an XML string to handle possible XML inconsistencies.
 * Wraps content in a root tag if it doesn't start with one.
 *
 * @param xmlString - The XML string to preprocess.
 * @returns The preprocessed XML string.
 * @throws Throws an error if the XML feed is empty.
 */
export function preprocessXml(xmlString: string, config: Config): string {
  let feed: string =
    config.requestSize !== null && config.requestSize !== undefined && config.requestSize > 0
      ? xmlString.slice(0, config.requestSize)
      : xmlString;
  feed = trimXmlFeed(feed);

  if (feed.trim() === "" || !feed.trim().startsWith("<")) {
    throw new Error("Invalid or empty XML feed.");
  }

  const wrappedString = feed.startsWith("<") ? feed : `<root>${feed}</root>`;
  const doc = parser.parseFromString(wrappedString, "text/xml");
  return new XMLSerializer().serializeToString(doc);
}

/**
 * Retrieves XML content from a given URL using the Fetch API.
 * Supports optional byte range requests.
 *
 * @param url - The URL from which to fetch the XML content.
 * @param config - Configuration options for the request, like request size.
 * @returns Resolves to the XML content as a string.
 * @throws Throws an error if there's an issue fetching the XML content.
 */
export async function fetchXmlFromUrl(url: string, config: Config): Promise<string> {
  try {
    const headers = config.requestHeaders != null ? { ...config.requestHeaders } : {};
    if (headers["User-Agent"] === undefined || headers["User-Agent"] === "") {
      headers["User-Agent"] = USER_AGENT;
    }
    if (typeof config.requestSize === "number" && config.requestSize > 0) {
      headers.Range = `bytes=0-${config.requestSize}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return trimXmlFeed(await response.text());
  } catch (error) {
    throw new Error("Error fetching from feed: " + url);
  }
}

/**
 * Retrieves XML content from a given source, which can be a URL, iTunes ID, or an XML string.
 *
 * @param source - The source of the XML content, can be a URL object, an iTunes ID, or an XML string.
 * @param config - Configuration options for the request, like request size.
 * @returns Object containing iTunes data (if relevant) and the XML string.
 * @throws Throws an error if the source type is invalid or if unable to fetch associated feed URL with the given iTunes ID.
 */
export async function retrieveXmlFromSource(
  source: string | URL | number,
  config: Config,
): Promise<{ itunes?: any; xmlString: string }> {
  if (source instanceof URL) {
    // Fetch the XML string from a URL
    return { xmlString: await fetchXmlFromUrl(source.toString(), config) };
  } else if (typeof source === "number") {
    // Fetch the iTunes information for the provided ID
    const itunes = await itunesLookup(source);

    if (itunes?.feedUrl == null || itunes.feedUrl === "") {
      throw new Error("Invalid iTunes ID or unable to fetch associated feed URL.");
    }

    // Fetch the XML string from the iTunes feed URL
    return { itunes, xmlString: await fetchXmlFromUrl(itunes.feedUrl, config) };
  }

  // If source is already an XML string, return it directly
  return { xmlString: source };
}

/**
 * Parses the given XML string into a Document object.
 *
 * @param preprocessedXml - The preprocessed XML string to be parsed.
 * @returns The parsed Document object.
 */
export function parse(preprocessedXml: string): Document {
  return parser.parseFromString(preprocessedXml, "text/xml");
}
