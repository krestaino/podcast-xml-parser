import { type Podcast, type Episode } from "./types";
import { getDuration } from "./sanitize";

/**
 * Extracts the text content from a specified XML element.
 *
 * @param element - The XML element to extract content from.
 * @param tagName - The name of the tag to retrieve content from.
 * @returns Text content of the tag, or an empty string if not found.
 */
function getText(element: Element, tagName: string): string {
  const node = element?.getElementsByTagName(tagName)[0];
  return node?.textContent ?? "";
}

/**
 * Constructs a Podcast object based on the provided XML item element.
 *
 * @param document - The XML element that represents a podcast.
 * @param source - XML content, a URL pointing to the podcast feed, or an iTunes collectionId.
 * @returns The created Podcast object with parsed values.
 */
export function createPodcast(document: Element, source: string | URL | number): Podcast {
  const channel = document.getElementsByTagName("channel")[0];
  const image = channel.getElementsByTagName("image")[0];

  let feedUrl = channel.getElementsByTagName("atom:link")[0]?.getAttribute("href") ?? "";
  if (feedUrl === "" && source instanceof URL) {
    feedUrl = source.toString();
  }

  return {
    copyright: getText(channel, "copyright"),
    contentEncoded: getText(channel, "content:encoded"),
    description: getText(channel, "description"),
    feedUrl,
    image: {
      link: getText(image, "link"),
      title: getText(image, "title"),
      url: getText(image, "url"),
    },
    itunesAuthor: getText(channel, "itunes:author"),
    itunesCategory: channel.getElementsByTagName("itunes:category")[0]?.getAttribute("text") ?? "",
    itunesExplicit: getText(channel, "itunes:explicit"),
    itunesImage: channel.getElementsByTagName("itunes:image")[0]?.getAttribute("href") ?? "",
    itunesOwner: {
      email: getText(channel, "itunes:email"),
      name: getText(channel, "itunes:name"),
    },
    itunesSubtitle: getText(channel, "itunes:subtitle"),
    itunesSummary: getText(channel, "itunes:summary"),
    itunesType: getText(channel, "itunes:type"),
    language: getText(channel, "language"),
    link: getText(channel, "link"),
    title: getText(channel, "title"),
  };
}

/**
 * Constructs an Episode object based on the provided XML item element.
 *
 * @param item - The XML element that represents an episode.
 * @returns The created Episode object with parsed values.
 */
export function createEpisode(item: Element): Episode {
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
    itunesDuration: getDuration(getText(item, "itunes:duration")),
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
