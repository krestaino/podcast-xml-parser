import { Podcast, Episode } from "../types";
import { getDuration } from "./sanitize";
import { parseXml } from "./parseXml";

/**
 * Transforms parsed XML data into a Podcast object.
 * @param parsedXML The parsed XML data as an XmlDocument.
 * @returns An object containing the transformed podcast and episodes data.
 * @throws An error if the expected XML structure is not found.
 */
export function transformPodcast(xmlText: string): { podcast: Podcast; episodes: Episode[] } {
  const parsedXML = parseXml(xmlText);
  const { rss } = parsedXML as any;

  const podcast: Podcast = {
    contentEncoded: rss?.channel?.["content:encoded"] ?? "",
    copyright: rss?.channel?.["copyright"] ?? "",
    description: rss?.channel?.["description"] ?? "",
    feedUrl: (rss?.channel?.["atom:link"]?.[0]?.["@_href"] || rss?.channel?.["atom:link"]?.["@_href"]) ?? "",
    image: {
      link: rss?.channel?.image?.["link"] ?? "",
      title: rss?.channel?.image?.["title"] ?? "",
      url: rss?.channel?.image?.["url"] ?? "",
    },
    itunesAuthor: rss?.channel?.["itunes:author"] ?? "",
    itunesCategory: rss?.channel?.["itunes:category"]?.["@_href"] ?? "",
    itunesExplicit: rss?.channel?.["itunes:explicit"] ?? "",
    itunesImage: rss?.channel?.["itunes:image"]?.["@_href"] ?? "",
    itunesOwner: {
      email: rss?.channel?.["itunes:owner"]?.["itunes:email"] ?? "",
      name: rss?.channel?.["itunes:owner"]?.["itunes:name"] ?? "",
    },
    itunesSubtitle: rss?.channel?.["itunes:subtitle"] ?? "",
    itunesSummary: rss?.channel?.["itunes:summary"] ?? "",
    itunesType: rss?.channel?.["itunes:type"] ?? "",
    language: rss?.channel?.["language"] ?? "",
    link: rss?.channel?.["link"] ?? "",
    title: rss?.channel?.["title"] ?? "",
  };

  const episodes: Episode[] = rss.channel.item.map((item: any) => ({
    title: item?.["title"] ?? "",
    description: item?.["description"] ?? "",
    pubDate: item?.["pubDate"] ?? "",
    enclosure: {
      url: item?.["enclosure"]?.["@_url"] ?? "",
      type: item?.["enclosure"]?.["@_type"],
    },
    itunesAuthor: item?.["itunes:author"] ?? "",
    itunesDuration: getDuration(item?.["itunes:duration"]) ?? 0,
    itunesEpisode: item?.["itunes:episode"] ?? "",
    itunesEpisodeType: item?.["itunes:episodeType"] ?? "",
    itunesExplicit: item?.["itunes:explicit"] ?? "",
    itunesSubtitle: item?.["itunes:subtitle"] ?? "",
    itunesSummary: item?.["itunes:summary"] ?? "",
    itunesTitle: item?.["itunes:title"] ?? "",
    link: item?.["link"] ?? "",
    guid: item?.["guid"] ?? "",
    author: item?.["author"] ?? "",
    contentEncoded: item?.["content:encoded"] ?? "",
  }));

  return { podcast, episodes };
}
