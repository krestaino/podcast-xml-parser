import { type Podcast, type Episode } from "./types";
/**
 * Constructs a Podcast object based on the provided XML item element.
 *
 * @param document - The XML element that represents a podcast.
 * @param source - XML content, a URL pointing to the podcast feed, or an iTunes collectionId.
 * @returns The created Podcast object with parsed values.
 */
export declare function createPodcast(document: Document, source: string | URL | number): Podcast;
/**
 * Constructs an Episode object based on the provided XML item element.
 *
 * @param item - The XML element that represents an episode.
 * @returns The created Episode object with parsed values.
 */
export declare function createEpisode(item: Element): Episode;
