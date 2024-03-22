import { XmlDocument, XmlElement, XmlNode, XmlText } from "@rgrove/parse-xml";
import { Podcast } from "../types/Podcast";

function isXmlElement(node: XmlNode): node is XmlElement {
  return node.type === "element";
}

function isXmlText(node: XmlNode): node is XmlText {
  return node.type === "text";
}

function getValue(element: XmlElement, name: string, attribute?: string): string {
  const foundElement = element.children.find(
    (child: XmlNode): child is XmlElement => isXmlElement(child) && child.name === name,
  );

  if (attribute && foundElement && isXmlElement(foundElement)) {
    return foundElement.attributes[attribute] || "";
  }

  return foundElement && isXmlElement(foundElement)
    ? foundElement.children.find(isXmlText)?.text || ""
    : "";
}

export function transformPodcastData(parsedXML: XmlDocument) {
  const root = parsedXML;

  if (!isXmlElement(root.children[0])) {
    throw new Error("Root element is not an XmlElement");
  }

  const channel = root.children[0].children.find(
    (element: XmlNode): element is XmlElement =>
      isXmlElement(element) && element.name === "channel",
  );

  if (!channel) {
    throw new Error("Channel element not found");
  }

  const image = channel.children.find(
    (element: XmlNode): element is XmlElement => isXmlElement(element) && element.name === "image",
  );

  if (!image) {
    throw new Error("Image element not found");
  }

  const itunesOwner = channel.children.find(
    (element: XmlNode): element is XmlElement =>
      isXmlElement(element) && element.name === "itunes:owner",
  );

  if (!itunesOwner) {
    throw new Error("iTunes owner element not found");
  }

  const podcast: Podcast = {
    contentEncoded: getValue(channel, "content:encoded"),
    copyright: getValue(channel, "copyright"),
    description: getValue(channel, "description"),
    feedUrl: getValue(channel, "atom:link", "href"),
    image: {
      link: getValue(image, "link"),
      title: getValue(image, "title"),
      url: getValue(image, "url"),
    },
    itunesAuthor: getValue(channel, "itunes:author"),
    itunesCategory: getValue(channel, "itunes:category", "text"),
    itunesExplicit: getValue(channel, "itunes:explicit"),
    itunesImage: getValue(channel, "itunes:image", "href"),
    itunesOwner: {
      email: getValue(itunesOwner, "itunes:email"),
      name: getValue(itunesOwner, "itunes:name"),
    },
    itunesSubtitle: getValue(channel, "itunes:subtitle"),
    itunesSummary: getValue(channel, "itunes:summary"),
    itunesType: getValue(channel, "itunes:type"),
    language: getValue(channel, "language"),
    link: getValue(channel, "link"),
    title: getValue(channel, "title"),
  };

  return {
    podcast,
    episodes: [],
  };
}
