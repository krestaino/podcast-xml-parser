/**
 * Represents the podcast.
 */
export interface Podcast {
  copyright: string;
  contentEncoded: string;
  description: string;
  feedUrl: string;
  image: { link: string; title: string; url: string } | null;
  itunesAuthor: string;
  itunesCategory: string | null;
  itunesExplicit: string;
  itunesImage: string | null;
  itunesOwner: { name: string; email: string } | null;
  itunesSubtitle: string;
  itunesSummary: string;
  itunesType: string;
  language: string;
  link: string;
  title: string;
}
