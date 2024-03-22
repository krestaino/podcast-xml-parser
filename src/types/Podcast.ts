/**
 * Represents the podcast.
 */
export interface Podcast {
  copyright: string;
  contentEncoded: string;
  description: string;
  feedUrl: string;
  image: {
    link: string;
    title: string;
    url: string;
  };
  itunesAuthor: string;
  itunesCategory: string;
  itunesExplicit: string;
  itunesImage: string;
  itunesOwner: {
    name: string;
    email: string;
  };
  itunesSubtitle: string;
  itunesSummary: string;
  itunesType: string;
  language: string;
  link: string;
  title: string;
}
