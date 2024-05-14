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
export function getAttribute(
  obj: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  path: string,
  defaultValue: string | boolean | number = "",
): string | boolean | number {
  const value = path.split(".").reduce((acc, part) => acc && acc[part], obj);
  let returnValue: string | boolean | number = defaultValue;

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
 * Converts a string to a boolean value. Handles case-insensitive "Yes" and "No" strings.
 *
 * @param value - The string value to convert.
 * @returns A boolean representation of the value.
 */
export function toBoolean(value: string | boolean): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lowerValue = value.toLowerCase();
    if (lowerValue === "yes") return true;
    if (lowerValue === "no") return false;
  }
  return false;
}

/**
 * Converts a string to a number. Returns null if the conversion fails or if the string contains non-numeric characters.
 *
 * @param value - The string value to convert.
 * @returns A number representation of the value, or null if the conversion fails or contains non-numeric characters.
 */
export function toNumber(value: string): number | null {
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  return null;
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
    contentEncoded: getAttribute(channel, "content:encoded") as string,
    copyright: getAttribute(channel, "copyright") as string,
    description: getAttribute(channel, "description") as string,
    feedUrl,
    image: {
      link: getAttribute(channel, "image.link") as string,
      title: getAttribute(channel, "image.title") as string,
      url: getAttribute(channel, "image.url") as string,
    },
    itunesAuthor: getAttribute(channel, "itunes:author") as string,
    itunesCategory: getAttribute(channel, "itunes:category.@_text") as string,
    itunesExplicit: toBoolean(getAttribute(channel, "itunes:explicit", false) as string | boolean),
    itunesImage: getAttribute(channel, "itunes:image.@_href") as string,
    itunesOwner: {
      email: getAttribute(channel, "itunes:owner.itunes:email") as string,
      name: getAttribute(channel, "itunes:owner.itunes:name") as string,
    },
    itunesSubtitle: getAttribute(channel, "itunes:subtitle") as string,
    itunesSummary: getAttribute(channel, "itunes:summary") as string,
    itunesType: getAttribute(channel, "itunes:type") as string,
    language: getAttribute(channel, "language") as string,
    link: getAttribute(channel, "link") as string,
    title: getAttribute(channel, "title") as string,
  };

  const episodes: Episode[] = ensureArray(channel.item).map((item) => ({
    title: getAttribute(item, "title") as string,
    description: getAttribute(item, "description") as string,
    pubDate: getAttribute(item, "pubDate") as string,
    enclosure: {
      url: getAttribute(item, "enclosure.@_url") as string,
      type: getAttribute(item, "enclosure.@_type") as string,
    },
    itunesAuthor: getAttribute(item, "itunes:author") as string,
    itunesDuration: getDuration(getAttribute(item, "itunes:duration")),
    itunesEpisode: toNumber(getAttribute(item, "itunes:episode") as string),
    itunesEpisodeType: getAttribute(item, "itunes:episodeType") as string,
    itunesExplicit: toBoolean(getAttribute(item, "itunes:explicit", "false") as string | boolean),
    itunesImage: getAttribute(item, "itunes:image.@_href") as string,
    itunesSeason: toNumber(getAttribute(item, "itunes:season") as string),
    itunesSubtitle: getAttribute(item, "itunes:subtitle") as string,
    itunesSummary: getAttribute(item, "itunes:summary") as string,
    itunesTitle: getAttribute(item, "itunes:title") as string,
    link: getAttribute(item, "link") as string,
    guid: getAttribute(item, "guid") as string,
    author: getAttribute(item, "author") as string,
    contentEncoded: getAttribute(item, "content:encoded") as string,
  }));

  return { podcast, episodes };
}
