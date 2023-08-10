import { DOMParser, XMLSerializer } from "xmldom";

import { type Podcast, type Episode, type Config } from "./types";
export type { Podcast, Episode, Config };

const parser = new DOMParser();

/**
 * Preprocesses an XML string to handle entities and unclosed tags.
 *
 * @param xmlString - The XML string to preprocess.
 * @returns The preprocessed XML string.
 */
function preprocessXml(xmlString: string): string {
  if (!xmlString.startsWith("<")) {
    xmlString = `<root>${xmlString}</root>`;
  }
  const doc = parser.parseFromString(xmlString, "text/xml");
  return new XMLSerializer().serializeToString(doc);
}

/**
 * Fetches XML content from a URL using Fetch API.
 *
 * @param {string} url - The URL from which to fetch the XML content.
 * @returns {Promise<string>} A Promise that resolves to the XML content as a string.
 * @throws {Error} If there is an error fetching the XML content from the URL.
 */
async function fetchXmlFromUrl(url: string, range?: string, fetchEnd?: boolean): Promise<string> {
  let headers: Record<string, string> = {};

  if (range) {
    headers['Range'] = range;
  }

  const response = await fetch(url, { headers });

  // You may want to check if partial content is returned
  if ((range || fetchEnd) && response.status !== 206) {
    throw new Error('Server does not support byte range requests.');
  }

  return await response.text();
}

/**
 * Retrieves the text content of a specified XML element.
 *
 * @param element - The XML element to retrieve content from.
 * @param tagName - The tag name whose content is to be retrieved.
 * @returns The text content of the specified element's tag or an empty string if not found.
 */
function getText(element: Element, tagName: string): string {
  const node = element?.getElementsByTagName(tagName)[0];
  return node?.textContent ?? "";
}

/**
 * Helper function to create an `Episode` instance from an XML item element.
 *
 * @param item - The XML element representing an episode.
 * @returns The created `Episode` object.
 */
function createEpisodeFromItem(item: Element): Episode {
  const enclosureElem = item.getElementsByTagName("enclosure")[0];

  return {
    author: getText(item, "author"),
    contentEncoded: getText(item, "content:encoded"),
    description: getText(item, "description"),
    enclosure: {
      url: enclosureElem?.getAttribute("url") ?? "",
      type: enclosureElem?.getAttribute("type") ?? "",
    },
    guid: getText(item, "guid"),
    itunesAuthor: getText(item, "itunes:author"),
    itunesDuration: getText(item, "itunes:duration"),
    itunesEpisode: getText(item, "itunes:episode"),
    itunesEpisodeType: getText(item, "itunes:episodeType"),
    itunesExplicit: getText(item, "itunes:explicit"),
    itunesSubtitle: getText(item, "itunes:subtitle"),
    itunesSummary: getText(item, "itunes:summary"),
    itunesTitle: getText(item, "itunes:title"),
    link: getText(item, "link"),
    pubDate: getText(item, "pubDate"),
    title: getText(item, "title"),
  };
}

/**
 * Parses an XML podcast feed and returns a `Podcast` object.
 *
 * @param xmlSource - The XML string or URL representing the podcast feed.
 *                    If an XML string is provided, it will be directly parsed as the XML content.
 *                    If a URL is provided, the XML content will be fetched from the URL before parsing.
 * @param config - A configuration object to specify pagination and other options.
 * @returns The parsed `Podcast` object.
 */
export default async function podcastXmlParser(
  xmlSource: string | URL,
  config: Config = {},
): Promise<{ podcast: Podcast; episodes: Episode[] }> {
  if (typeof xmlSource === "string" && xmlSource.trim() === "") {
    throw new Error("Empty XML feed. Please provide valid XML content.");
  }

  let xmlString: string;

  // Check if xmlSource is a URL
  if (xmlSource instanceof URL) {
    if (config.requestSizeLimit) {
      const startChunk = await fetchXmlFromUrl(xmlSource.toString(), `bytes=0-${config.requestSizeLimit}`);
      xmlString = startChunk;
    } else {
      xmlString = await fetchXmlFromUrl(xmlSource.toString());
    }
  } else {
    xmlString = xmlSource;
  }

  const preprocessedXml = preprocessXml(xmlString);
  const doc = parser.parseFromString(preprocessedXml, "text/xml");
  const docElement = doc.documentElement;

  const { start = 0, limit } = config;

  const episodeElements = Array.from(doc.getElementsByTagName("item"));
  const paginatedElements = limit !== undefined ? episodeElements.slice(start, start + limit) : episodeElements;
  const episodes = paginatedElements.map(createEpisodeFromItem);

  const imageElem = docElement.getElementsByTagName("image")[0];
  const podcast: Podcast = {
    copyright: getText(docElement, "copyright"),
    contentEncoded: getText(doc.documentElement, "content:encoded"),
    description: getText(doc.documentElement, "description"),
    feedUrl:
      xmlSource instanceof URL
        ? xmlSource.toString()
        : doc.getElementsByTagName("atom:link")[0]?.getAttribute("href") ?? "",
    image: {
      link: getText(imageElem, "link"),
      title: getText(imageElem, "title"),
      url: getText(imageElem, "url"),
    },
    itunesAuthor: getText(doc.documentElement, "itunes:author"),
    itunesCategory: doc.getElementsByTagName("itunes:category")[0]?.getAttribute("text") ?? "",
    itunesExplicit: getText(doc.documentElement, "itunes:explicit"),
    itunesImage: doc.getElementsByTagName("itunes:image")[0]?.getAttribute("href") ?? "",
    itunesOwner: {
      email: getText(doc.documentElement, "itunes:email"),
      name: getText(doc.documentElement, "itunes:name"),
    },
    itunesSubtitle: getText(doc.documentElement, "itunes:subtitle"),
    itunesSummary: getText(doc.documentElement, "itunes:summary"),
    itunesType: getText(doc.documentElement, "itunes:type"),
    language: getText(doc.documentElement, "language"),
    link: getText(doc.documentElement, "link"),
    title: getText(doc.documentElement, "title"),
  };

  return { podcast, episodes };
}
