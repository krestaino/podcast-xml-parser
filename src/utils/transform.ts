import { XmlDocument } from "@rgrove/parse-xml";

import { Podcast } from "../types/Podcast";
import { getAttributeValue, getTextValue, getXmlElement, isXmlElement } from "./xml";

export function transformPodcastData(parsedXML: XmlDocument) {
  const rootElement = parsedXML.children[0];
  if (!isXmlElement(rootElement)) {
    throw new Error("Root element is not an XmlElement");
  }

  const channel = getXmlElement(rootElement, "channel");
  if (!channel) {
    throw new Error("Channel element not found");
  }

  const image = getXmlElement(channel, "image");
  if (!image) {
    throw new Error("Image element not found");
  }

  const itunesOwner = getXmlElement(channel, "itunes:owner");
  if (!itunesOwner) {
    throw new Error("iTunes owner element not found");
  }

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

  return { podcast, episodes: [] };
}
