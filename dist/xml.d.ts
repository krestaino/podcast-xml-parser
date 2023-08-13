import { type Config } from "./types";
/**
 * Preprocesses an XML string to handle possible XML inconsistencies.
 * Wraps content in a root tag if it doesn't start with one.
 *
 * @param xmlString - The XML string to preprocess.
 * @returns The preprocessed XML string.
 * @throws Throws an error if the XML feed is empty.
 */
export declare function preprocessXml(xmlString: string): string;
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
