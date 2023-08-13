import { type Config } from "./types";
/**
 * Preprocesses an XML string to handle possible XML inconsistencies.
 * Wraps content in a root tag if it doesn't start with one.
 *
 * @param {string} xmlString - The XML string to preprocess.
 * @returns {string} The preprocessed XML string.
 * @throws {Error} Throws an error if the XML feed is empty.
 */
export declare function preprocessXml(xmlString: string): string;
/**
 * Retrieves XML content from a given source, which can be a URL, iTunes ID, or an XML string.
 *
 * @param {string | URL | number} source - The source of the XML content, can be a URL object, an iTunes ID, or an XML string.
 * @param {Config} config - Configuration options for the request, like request size.
 * @returns {Promise<{ itunes?: any; xmlString: string }>} Object containing iTunes data (if relevant) and the XML string.
 * @throws {Error} Throws an error if the source type is invalid or if unable to fetch associated feed URL with the given iTunes ID.
 */
export declare function retrieveXmlFromSource(source: string | URL | number, config: Config): Promise<{
    itunes?: any;
    xmlString: string;
}>;
export declare function parse(preprocessedXml: string): Document;
