import { XMLParser } from "fast-xml-parser";

const options = {
  ignoreAttributes: false,
};

const parser = new XMLParser(options);

/**
 * Parses the provided XML text into a JavaScript object.
 * @param xmlText The XML text to parse.
 * @returns A JavaScript object representation of the XML.
 */
export function parseXml(xmlText: string): unknown {
  return parser.parse(xmlText);
}
