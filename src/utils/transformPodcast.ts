import { XmlDocument, XmlElement } from "@rgrove/parse-xml";

import { Podcast, Episode } from "../types";
import { getAttributeValue, getTextValue, getXmlElement, isXmlElement } from "./parseXml";

/**
 * Transforms parsed XML data into a Podcast object.
 * @param parsedXML The parsed XML data as an XmlDocument.
 * @returns An object containing the transformed podcast and episodes data.
 * @throws An error if the expected XML structure is not found.
 */
export function transformPodcast(parsedXML: XmlDocument): { podcast: Podcast; episodes: Episode[] } {
  const rootElement = parsedXML.children[0] as XmlElement;
  const channel = getXmlElement(rootElement, "channel");

  if (!channel) {
    throw new Error("Channel element not found");
  }

  const image = getXmlElement(channel, "image");
  const itunesOwner = getXmlElement(channel, "itunes:owner");

  const podcast: Podcast = {
    contentEncoded: getTextValue(channel, "content:encoded"),
    copyright: getTextValue(channel, "copyright"),
    description: getTextValue(channel, "description"),
    feedUrl: getAttributeValue(channel, "atom:link", "href"),
    image: {
      link: getTextValue(image, "link"),
      title: getTextValue(image, "title"),
      url: getTextValue(image, "url"),
    },
    itunesAuthor: getTextValue(channel, "itunes:author"),
    itunesCategory: getAttributeValue(channel, "itunes:category", "text"),
    itunesExplicit: getTextValue(channel, "itunes:explicit"),
    itunesImage: getAttributeValue(channel, "itunes:image", "href"),
    itunesOwner: {
      email: getTextValue(itunesOwner, "itunes:email"),
      name: getTextValue(itunesOwner, "itunes:name"),
    },
    itunesSubtitle: getTextValue(channel, "itunes:subtitle"),
    itunesSummary: getTextValue(channel, "itunes:summary"),
    itunesType: getTextValue(channel, "itunes:type"),
    language: getTextValue(channel, "language"),
    link: getTextValue(channel, "link"),
    title: getTextValue(channel, "title"),
  };

  const episodes: Episode[] = channel.children
    .filter((child): child is XmlElement => isXmlElement(child) && child.name === "item")
    .map((item) => ({
      title: getTextValue(item, "title"),
      description: getTextValue(item, "description"),
      pubDate: getTextValue(item, "pubDate"),
      enclosure: {
        url: getAttributeValue(item, "enclosure", "url"),
        type: getAttributeValue(item, "enclosure", "type"),
      },
      itunesAuthor: getTextValue(item, "itunes:author"),
      itunesDuration: parseInt(getTextValue(item, "itunes:duration"), 10) || 0,
      itunesEpisode: getTextValue(item, "itunes:episode"),
      itunesEpisodeType: getTextValue(item, "itunes:episodeType"),
      itunesExplicit: getTextValue(item, "itunes:explicit"),
      itunesSubtitle: getTextValue(item, "itunes:subtitle"),
      itunesSummary: getTextValue(item, "itunes:summary"),
      itunesTitle: getTextValue(item, "itunes:title"),
      link: getTextValue(item, "link"),
      guid: getTextValue(item, "guid"),
      author: getTextValue(item, "author"),
      contentEncoded: getTextValue(item, "content:encoded"),
    }));

  return { podcast, episodes };
}
