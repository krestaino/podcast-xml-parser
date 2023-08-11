import { DOMParser, XMLSerializer } from "xmldom";

import { type Podcast, type Episode, type Config } from "./types";
export type { Podcast, Episode, Config };

const parser = new DOMParser();

/**
 * Preprocesses an XML string to handle possible XML inconsistencies like entities and unclosed tags.
 *
 * @param {string} xmlString - The XML string to preprocess.
 * @returns {string} The preprocessed XML string.
 */
function preprocessXml(xmlString: string): string {
  if (!xmlString.startsWith("<")) {
    xmlString = `<root>${xmlString}</root>`;
  }
  const doc = parser.parseFromString(xmlString, "text/xml");
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
  let headers: Record<string, string> = {};

  if (range) {
    headers['Range'] = range;
  }

  const response = await fetch(url, { headers });

  // Check if partial content is returned
  if ((range || fetchEnd) && response.status !== 206) {
    throw new Error('Server does not support byte range requests.');
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
 * Constructs an Episode object based on the provided XML item element.
 *
 * @param {Element} item - The XML element that represents an episode.
 * @returns {Episode} The created Episode object with parsed values.
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
 * Fetches podcast information from iTunes based on the provided podcast ID.
 *
 * @param {number} id - The podcast ID for iTunes search.
 * @returns {Promise<any | undefined>} The search results for the podcast from iTunes or undefined on error.
 */
export async function itunesSearch(id: number): Promise<any | undefined> {
  try {
    const itunesResponse = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=podcast`);
    const itunesData = await itunesResponse.json();
    const itunes = itunesData.results[0];
    const { podcast, episodes } = await podcastXmlParser(new URL(itunes.feedUrl));

    return { itunes, podcast, episodes };
  } catch (err) {
    return undefined;
  }
}

/**
 * Parses a podcast's XML feed and returns structured data about the podcast and its episodes.
 * Supports optional iTunes integration to retrieve additional details.
 *
 * @param {string | URL} xmlSource - XML content or a URL pointing to the podcast feed.
 * @param {Config} [config] - Configuration options for parsing, like pagination or iTunes integration.
 * @returns {Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: any }>} Parsed podcast data.
 * @throws {Error} Throws an error for invalid or empty XML feeds.
 */
export default async function podcastXmlParser(
  xmlSource: string | URL,
  config: Config = {}
): Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: any }> {
  if (typeof xmlSource === "string" && xmlSource.trim() === "") {
    throw new Error("Empty XML feed. Please provide valid XML content.");
  }

  let xmlString: string;

  // Check if xmlSource is a URL
  if (xmlSource instanceof URL) {
    if (config.requestSizeLimit) {
      const startChunk = await fetchXmlFromUrl(xmlSource.toString(), `bytes=0-${config.requestSizeLimit}`);
      xmlString = startChunk + "</channel></rss>";
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

  if (config.itunes) {
    try {
      const itunesResponse = await fetch(`https://itunes.apple.com/search?term=${podcast.title}&entity=podcast`);
      let itunes: any = await itunesResponse.json();
      itunes = itunes.results.find((result: any) => result.feedUrl === podcast.feedUrl);
      return { itunes, podcast, episodes };
    } catch (err) {
      throw new Error('Error fetching from iTunes.');
    }
  }

  return { podcast, episodes };
}
