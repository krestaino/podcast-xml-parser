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
  itunesEpisode: number;
  itunesEpisodeType: string;
  itunesExplicit: string;
  itunesImage: string;
  itunesSeason: number;
  itunesSubtitle: string;
  itunesSummary: string;
  itunesTitle: string;
  link: string;
  pubDate: string;
  title: string;
}
