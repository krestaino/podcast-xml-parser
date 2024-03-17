import { type Podcast, type Episode } from "./types";
import { getDuration } from "./sanitize";
import { removeItemsFromDocument } from "./xml";

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
export function createPodcast(document: Document, source: string | URL | number): Podcast {
  const documentElement = removeItemsFromDocument(document).documentElement;
  const imageElem = documentElement.getElementsByTagName("image")[0];

  let feedUrl: URL | null = null;
  const feedUrlString = documentElement.getElementsByTagName("atom:link")[0]?.getAttribute("href") ?? "";

  if (feedUrlString !== "") {
    try {
      feedUrl = new URL(feedUrlString);
    } catch (error) {
      console.error("Invalid feed URL:", feedUrlString);
      feedUrl = null;
    }
  } else if (source instanceof URL) {
    feedUrl = source;
  }

  return {
    copyright: getText(documentElement, "copyright"),
    contentEncoded: getText(documentElement, "content:encoded"),
    description: getText(documentElement, "description"),
    feedUrl,
    image: {
      link: getText(imageElem, "link"),
      title: getText(imageElem, "title"),
      url: getText(imageElem, "url"),
    },
    itunesAuthor: getText(documentElement, "itunes:author"),
    itunesCategory: documentElement.getElementsByTagName("itunes:category")[0]?.getAttribute("text") ?? "",
    itunesExplicit: getText(documentElement, "itunes:explicit"),
    itunesImage: documentElement.getElementsByTagName("itunes:image")[0]?.getAttribute("href") ?? "",
    itunesOwner: {
      email: getText(documentElement, "itunes:email"),
      name: getText(documentElement, "itunes:name"),
    },
    itunesSubtitle: getText(documentElement, "itunes:subtitle"),
    itunesSummary: getText(documentElement, "itunes:summary"),
    itunesType: getText(documentElement, "itunes:type"),
    language: getText(documentElement, "language"),
    link: getText(documentElement, "link"),
    title: getText(documentElement, "title"),
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
