import { parseXml, XmlDocument } from "@rgrove/parse-xml";

/**
 * Parses the provided XML text into a JavaScript object.
 * @param xmlText The XML text to parse.
 * @returns A JavaScript object representation of the XML.
 */
export function parsePodcastXML(xmlText: string): XmlDocument {
  return parseXml(xmlText);
}
