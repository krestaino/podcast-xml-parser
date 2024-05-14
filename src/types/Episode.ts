export interface Episode {
  author: string;
  contentEncoded: string;
  description: string;
  enclosure: {
    url: string;
    type: string;
  };
  guid: string;
  itunesAuthor: string;
  itunesDuration: number;
  itunesEpisode: number | null;
  itunesEpisodeType: string;
  itunesExplicit: boolean;
  itunesImage: string;
  itunesSeason: number | null;
  itunesSubtitle: string;
  itunesSummary: string;
  itunesTitle: string;
  link: string;
  pubDate: string;
  title: string;
}
