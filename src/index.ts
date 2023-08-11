import { DOMParser, XMLSerializer } from "xmldom";

import { type Podcast, type Episode, type Config } from "./types";
export type { Podcast, Episode, Config };

const parser = new DOMParser();

/**
 * Preprocesses an XML string to handle possible XML inconsistencies.
 * Wraps content in a root tag if it doesn't start with one.
 *
 * @param {string} xmlString - The XML string to preprocess.
 * @returns {string} The preprocessed XML string.
 */
function preprocessXml(xmlString: string): string {
  // Check if xmlSource is a valid XML string
  if (xmlString.trim() === "") {
    throw new Error("Empty XML feed. Please provide valid XML content.");
  }
  const wrappedString = xmlString.startsWith("<") ? xmlString : `<root>${xmlString}</root>`;
  const doc = parser.parseFromString(wrappedString, "text/xml");
  return new XMLSerializer().serializeToString(doc);
}

/**
 * Retrieves XML content from a given URL using the Fetch API.
 * Supports optional byte range requests.
 *
 * @param {string} url - The URL from which to fetch the XML content.
 * @param {string} [range] - Optional range for byte requests.
 * @param {boolean} [fetchEnd] - If true, fetch from the end of the range.
 * @returns {Promise<string>} Resolves to the XML content as a string.
 * @throws {Error} Throws an error if there's an issue fetching the XML content.
 */
async function fetchXmlFromUrl(url: string, range?: string, fetchEnd?: boolean): Promise<string> {
  const headers: Record<string, string> = {};

  if (range !== null && range !== undefined && range.trim() !== "") {
    headers.Range = range;
  }

  const response = await fetch(url, { headers });

  // Check if partial content is returned
  if ((range ?? fetchEnd) !== undefined && response.status !== 206) {
    throw new Error("Server does not support byte range requests.");
  }

  return await response.text();
}

/**
 * Extracts the text content from a specified XML element.
 *
 * @param {Element} element - The XML element to extract content from.
 * @param {string} tagName - The name of the tag to retrieve content from.
 * @returns {string} Text content of the tag, or an empty string if not found.
 */
function getText(element: Element, tagName: string): string {
  const node = element?.getElementsByTagName(tagName)[0];
  return node?.textContent ?? "";
}

/**
 * Constructs a Podcast object based on the provided XML item element.
 *
 * @param {Element} document - The XML element that represents a podcast.
 * @returns {Podcast} The created Podcast object with parsed values.
 */
function createPodcast(document: Element): Podcast {
  const imageElem = document.getElementsByTagName("image")[0];

  return {
    copyright: getText(document, "copyright"),
    contentEncoded: getText(document, "content:encoded"),
    description: getText(document, "description"),
    feedUrl: document.getElementsByTagName("atom:link")[0]?.getAttribute("href") ?? "",
    image: {
      link: getText(imageElem, "link"),
      title: getText(imageElem, "title"),
      url: getText(imageElem, "url"),
    },
    itunesAuthor: getText(document, "itunes:author"),
    itunesCategory: document.getElementsByTagName("itunes:category")[0]?.getAttribute("text") ?? "",
    itunesExplicit: getText(document, "itunes:explicit"),
    itunesImage: document.getElementsByTagName("itunes:image")[0]?.getAttribute("href") ?? "",
    itunesOwner: {
      email: getText(document, "itunes:email"),
      name: getText(document, "itunes:name"),
    },
    itunesSubtitle: getText(document, "itunes:subtitle"),
    itunesSummary: getText(document, "itunes:summary"),
    itunesType: getText(document, "itunes:type"),
    language: getText(document, "language"),
    link: getText(document, "link"),
    title: getText(document, "title"),
  };
}

/**
 * Constructs an Episode object based on the provided XML item element.
 *
 * @param {Element} item - The XML element that represents an episode.
 * @returns {Episode} The created Episode object with parsed values.
 */
function createEpisode(item: Element): Episode {
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
 * Fetches podcast information from iTunes based on the provided podcast ID.
 *
 * @param {number} id - The podcast ID for iTunes search.
 * @returns {Promise<any | undefined>} The search results for the podcast from iTunes or undefined on error.
 */
async function itunesLookup(id: number): Promise<any | undefined> {
  try {
    const itunesResponse = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=podcast`);
    const itunesData = await itunesResponse.json();
    return itunesData.results[0];
  } catch (err) {
    return undefined;
  }
}

/**
 * Parses a podcast's XML feed and returns structured data about the podcast and its episodes.
 * Supports optional iTunes integration to retrieve additional details.
 *
 * @param {string | URL | number} xmlSource - XML content, a URL pointing to the podcast feed, or an iTunes collectionId.
 * @param {Config} [config] - Configuration options for parsing, like pagination or iTunes integration.
 * @returns {Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: any }>} Parsed podcast data.
 * @throws {Error} Throws an error for invalid or empty XML feeds.
 */
export default async function podcastXmlParser(
  xmlSource: string | URL | number,
  config: Config = {},
): Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: any }> {
  let itunes: any;
  let xmlString: string = "";

  // Check if xmlSource is a URL
  if (xmlSource !== "" && xmlSource !== 0 && xmlSource instanceof URL) {
    if (config.requestSizeLimit !== null && config.requestSizeLimit !== undefined) {
      const startChunk = await fetchXmlFromUrl(xmlSource.toString(), `bytes=0-${config.requestSizeLimit}`);
      xmlString = startChunk + "</channel></rss>";
    } else {
      xmlString = await fetchXmlFromUrl(xmlSource.toString());
    }
    // Check if xmlSource is a number (iTunes ID)
  } else if (typeof xmlSource === "number") {
    itunes = await itunesLookup(xmlSource);
    xmlString = await fetchXmlFromUrl(itunes.feedUrl);
    // Check if xmlSource is a string
  } else if (typeof xmlSource === "string") {
    xmlString = xmlSource;
  }

  // Cleanup XML
  const preprocessedXml = preprocessXml(xmlString);

  // Parse XML
  const doc = parser.parseFromString(preprocessedXml, "text/xml");

  // Set podcast data
  const podcast = createPodcast(doc.documentElement);

  // Grab episodes from XML
  const episodeElements = Array.from(doc.getElementsByTagName("item"));

  // Optionally paginate episodes using config, otherwise use all episodes
  const { start = 0, limit } = config;
  const paginatedElements = limit !== undefined ? episodeElements.slice(start, start + limit) : episodeElements;

  // Set episodes data
  const episodes = paginatedElements.map(createEpisode);

  // Optionally set itunes data
  if (config.itunes === true) {
    try {
      if (itunes === null || itunes === undefined) {
        const itunesResponse = await fetch(`https://itunes.apple.com/search?term=${podcast.title}&entity=podcast`);
        itunes = await itunesResponse.json();
        // Set podcast if the feedUrl is equal on iTunes and in the XML
        itunes = itunes.results.find((result: any) => result.feedUrl === podcast.feedUrl);
      }

      // All done, return data
      return { itunes, podcast, episodes };
    } catch (err) {
      throw new Error("Error fetching from iTunes.");
    }
  }

  // All done, return data
  return { podcast, episodes };
}
