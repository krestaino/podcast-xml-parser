/**
 * Represents the podcast.
 */
export interface Podcast {
    copyright: string;
    contentEncoded: string;
    description: string;
    feedUrl: URL | null;
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
/**
 * Represents the config.
 */
export interface Config {
    start?: number;
    limit?: number;
    requestHeaders?: Record<string, string>;
    requestSize?: number;
    itunes?: boolean;
}
/**
 * Represents the additional details that can be fetched from iTunes.
 */
export interface Itunes {
    wrapperType?: string;
    kind?: string;
    collectionId?: number;
    trackId?: number;
    artistName?: string;
    collectionName?: string;
    trackName?: string;
    collectionCensoredName?: string;
    trackCensoredName?: string;
    collectionViewUrl?: string;
    feedUrl?: string;
    trackViewUrl?: string;
    artworkUrl30?: string;
    artworkUrl60?: string;
    artworkUrl100?: string;
    artworkUrl600?: string;
    collectionPrice?: number;
    trackPrice?: number;
    trackRentalPrice?: number;
    collectionHdPrice?: number;
    trackHdPrice?: number;
    trackHdRentalPrice?: number;
    releaseDate?: string;
    collectionExplicitness?: string;
    trackExplicitness?: string;
    trackCount?: number;
    country?: string;
    currency?: string;
    primaryGenreName?: string;
    contentAdvisoryRating?: string;
    genreIds?: string[];
    genres?: string[];
}
