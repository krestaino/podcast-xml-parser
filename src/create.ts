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
 * @returns The created Podcast object with parsed values.
 */
export function createPodcast(document: Element): Podcast {
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
