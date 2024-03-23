import { Podcast, Episode } from "../types";
import { getDuration, parseXml } from "../utils";

function getAttribute(obj: any, path: string, defaultValue = ""): string {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj) ?? defaultValue;
}

/**
 * Transforms parsed XML data into a Podcast object.
 * @param parsedXML The parsed XML data as an XmlDocument.
 * @returns An object containing the transformed podcast and episodes data.
 * @throws An error if the expected XML structure is not found.
 */
export function transformPodcast(xmlText: string): { podcast: Podcast; episodes: Episode[] } {
  const parsedXML = parseXml(xmlText);
  const { rss } = parsedXML as any;
  const channel = rss?.channel;

  let atomLink = channel?.["atom:link"];
  if (Array.isArray(atomLink)) {
    atomLink = atomLink.find((link: any) => link["@_rel"] === "self");
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
    itunesCategory: getAttribute(channel, "itunes:category.@_href"),
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

  const episodes: Episode[] = (Array.isArray(channel?.item) ? channel.item : []).map((item: any) => ({
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
