import { XmlDocument, XmlElement } from "@rgrove/parse-xml";

import { getXmlElement, isXmlElement } from "./xml";

/**
 * Transforms parsed OPML XML data into an array of feed URLs.
 * @param parsedXML The parsed OPML XML data as an XmlDocument.
 * @returns An array of feed URLs extracted from the OPML data.
 * @throws {Error} If the expected XML structure is not found.
 */
export function transformOpml(parsedXML: XmlDocument): string[] {
  const rootElement = parsedXML.children[0] as XmlElement;
  const body = getXmlElement(rootElement, "body") as XmlElement;
  if (!body) {
    throw new Error("Body element not found");
  }

  const outline = getXmlElement(body, "outline") as XmlElement;
  if (!outline) {
    throw new Error("Outline element not found");
  }

  const feeds: string[] = outline.children
    .filter((child): child is XmlElement => isXmlElement(child) && child.name === "outline")
    .map((item) => item.attributes["xmlUrl"]);

  return feeds;
}
