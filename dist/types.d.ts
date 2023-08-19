/**
 * Represents an individual podcast episode.
 */
export interface Episode {
    author: string;
    contentEncoded: string;
    description: string;
    enclosure: {
        url: string;
        type: string;
    } | null;
    guid: string;
    itunesAuthor: string;
    itunesDuration: number | undefined;
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
/**
 * Represents a podcast with multiple episodes.
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
    } | null;
    itunesAuthor: string;
    itunesCategory: string | null;
    itunesExplicit: string;
    itunesImage: string | null;
    itunesOwner: {
        name: string;
        email: string;
    } | null;
    itunesSubtitle: string;
    itunesSummary: string;
    itunesType: string;
    language: string;
    link: string;
    title: string;
}
/**
 * Represents the config.
 */
export interface Config {
    start?: number;
    limit?: number;
    requestSize?: number;
    itunes?: boolean;
}
