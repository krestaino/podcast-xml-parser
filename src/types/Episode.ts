/**
 * Represents an individual podcast episode.
 */
export interface Episode {
  author: string;
  contentEncoded: string;
  description: string;
  enclosure: { url: string; type: string } | null;
  guid: string;
  itunesAuthor: string;
  itunesDuration: number;
  itunesEpisode: string;
  itunesEpisodeType: string;
  itunesExplicit: string;
  itunesSubtitle: string;
  itunesSummary: string;
  itunesTitle: string;
  link: string;
  pubDate: string;
  title: string;
}
