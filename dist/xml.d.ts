import { type Config } from "./types";
/**
 * Removes all <item> elements from a cloned copy of the provided XML document.
 * This function is useful for processing podcast feeds where you want to
 * separate podcast metadata from individual episode information.
 *
 * @param originalDocument - The original XML document from which to remove <item> elements.
 * @returns A new XML document with all <item> elements removed.
 */
export declare function removeItemsFromDocument(originalDocument: Document): Document;
/**
 * Preprocesses an XML string to handle possible XML inconsistencies.
 * Wraps content in a root tag if it doesn't start with one.
 *
 * @param xmlString - The XML string to preprocess.
 * @returns The preprocessed XML string.
 * @throws Throws an error if the XML feed is empty.
 */
export declare function preprocessXml(xmlString: string, config: Config): string;
/**
 * Retrieves XML content from a given URL using the Fetch API.
 * Supports optional byte range requests.
 *
 * @param url - The URL from which to fetch the XML content.
 * @param config - Configuration options for the request, like request size.
 * @returns Resolves to the XML content as a string.
 * @throws Throws an error if there's an issue fetching the XML content.
 */
export declare function fetchXmlFromUrl(url: string, config: Config): Promise<string>;
/**
 * Retrieves XML content from a given source, which can be a URL, iTunes ID, or an XML string.
 *
 * @param source - The source of the XML content, can be a URL object, an iTunes ID, or an XML string.
 * @param config - Configuration options for the request, like request size.
 * @returns Object containing iTunes data (if relevant) and the XML string.
 * @throws Throws an error if the source type is invalid or if unable to fetch associated feed URL with the given iTunes ID.
 */
export declare function retrieveXmlFromSource(source: string | URL | number, config: Config): Promise<{
    itunes?: any;
    xmlString: string;
}>;
/**
 * Parses the given XML string into a Document object.
 *
 * @param preprocessedXml - The preprocessed XML string to be parsed.
 * @returns The parsed Document object.
 */
export declare function parse(preprocessedXml: string): Document;
