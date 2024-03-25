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
  itunesEpisode: string;
  itunesEpisodeType: string;
  itunesExplicit: string;
  itunesImage: string;
  itunesSubtitle: string;
  itunesSummary: string;
  itunesTitle: string;
  link: string;
  pubDate: string;
  title: string;
}
