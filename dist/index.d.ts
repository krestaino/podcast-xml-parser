import { type Podcast, type Episode } from "./types";
export type { Podcast, Episode };
/**
 * Parses an XML podcast feed and returns a `Podcast` object.
 *
 * @param xmlSource - The XML string or URL representing the podcast feed.
 *                    If an XML string is provided, it will be directly parsed as the XML content.
 *                    If a URL is provided, the XML content will be fetched from the URL before parsing.
 * @returns The parsed `Podcast` object.
 */
export default function podcastXmlParser(xmlSource: string | URL): Promise<{
    podcast: Podcast;
    episodes: Episode[];
}>;
