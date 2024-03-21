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
