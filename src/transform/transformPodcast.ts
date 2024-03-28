import { ERROR_MESSAGES } from "../constants";
import { Episode, ParsedXML, Podcast } from "../types";
import { getDuration, parseXml } from "../utils";

/**
 * Retrieves the value of a specified attribute from an object or an array of objects.
 *
 * @param obj - The object or array of objects to search.
 * @param path - The path to the attribute, separated by dots.
 * @param defaultValue - The default value to return if the attribute is not found.
 * @returns The value of the attribute, or the default value if not found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAttribute(obj: any, path: string, defaultValue = ""): string {
  const value = path.split(".").reduce((acc, part) => acc && acc[part], obj);
  let returnValue = defaultValue;

  if (Array.isArray(value)) {
    if (value.length > 0 && value[0]["@_text"]) {
      returnValue = value[0]["@_text"];
    }
  } else if (typeof value === "object" && value?.["#text"]) {
    returnValue = value["#text"];
  } else if (value !== undefined && value !== null) {
    returnValue = value;
  }

  return typeof returnValue === "string" ? returnValue.trim() : returnValue;
}

/**
 * Ensures that the input is an array. If the input is not an array, it is wrapped in an array.
 * If the input is null or undefined, an empty array is returned.
 *
 * @param item - The input to ensure as an array.
 * @returns An array containing the input, or an empty array if the input is null or undefined.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureArray(item: any): any[] {
  if (Array.isArray(item)) {
    return item;
  }
  return item ? [item] : [];
}

/**
 * Transforms parsed XML data into a Podcast object.
 *
 * @param parsedXML - The parsed XML data as an XmlDocument.
 * @returns An object containing the transformed podcast and episodes data.
 * @throws An error if the expected XML structure is not found.
 */
export function transformPodcast(xmlText: string): { podcast: Podcast; episodes: Episode[] } {
  const parsedXML = parseXml(xmlText) as ParsedXML;
  const channel = parsedXML.rss?.channel;

  if (!channel) {
    throw new Error(ERROR_MESSAGES.XML_NO_FEED_TO_PARSE);
  }

  let atomLink = channel["atom:link"];
  if (Array.isArray(atomLink)) {
    atomLink = atomLink.find((link) => link["@_rel"] === "self");
  }
  const feedUrl = atomLink?.["@_href"] ?? "";

  const podcast: Podcast = {
    contentEncoded: getAttribute(channel, "content:encoded"),
    copyright: getAttribute(channel, "copyright"),
    description: getAttribute(channel, "description"),
    feedUrl,
    image: {
      link: getAttribute(channel, "image.link"),
      title: getAttribute(channel, "image.title"),
      url: getAttribute(channel, "image.url"),
    },
    itunesAuthor: getAttribute(channel, "itunes:author"),
    itunesCategory: getAttribute(channel, "itunes:category"),
    itunesExplicit: getAttribute(channel, "itunes:explicit"),
    itunesImage: getAttribute(channel, "itunes:image.@_href"),
    itunesOwner: {
      email: getAttribute(channel, "itunes:owner.itunes:email"),
      name: getAttribute(channel, "itunes:owner.itunes:name"),
    },
    itunesSubtitle: getAttribute(channel, "itunes:subtitle"),
    itunesSummary: getAttribute(channel, "itunes:summary"),
    itunesType: getAttribute(channel, "itunes:type"),
    language: getAttribute(channel, "language"),
    link: getAttribute(channel, "link"),
    title: getAttribute(channel, "title"),
  };

  const episodes: Episode[] = ensureArray(channel.item).map((item) => ({
    title: getAttribute(item, "title"),
    description: getAttribute(item, "description"),
    pubDate: getAttribute(item, "pubDate"),
    enclosure: {
      url: getAttribute(item, "enclosure.@_url"),
      type: getAttribute(item, "enclosure.@_type"),
    },
    itunesAuthor: getAttribute(item, "itunes:author"),
    itunesDuration: getDuration(getAttribute(item, "itunes:duration")),
    itunesEpisode: getAttribute(item, "itunes:episode"),
    itunesEpisodeType: getAttribute(item, "itunes:episodeType"),
    itunesExplicit: getAttribute(item, "itunes:explicit"),
    itunesImage: getAttribute(item, "itunes:image.@_href"),
    itunesSubtitle: getAttribute(item, "itunes:subtitle"),
    itunesSummary: getAttribute(item, "itunes:summary"),
    itunesTitle: getAttribute(item, "itunes:title"),
    link: getAttribute(item, "link"),
    guid: getAttribute(item, "guid"),
    author: getAttribute(item, "author"),
    contentEncoded: getAttribute(item, "content:encoded"),
  }));

  return { podcast, episodes };
}
