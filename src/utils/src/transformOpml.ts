import { XmlDocument, XmlElement } from "@rgrove/parse-xml";

import { getXmlElement, isXmlElement } from "./parseXml";

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

  const outlines: XmlElement[] = [];
  body.children.forEach((child) => {
    if (isXmlElement(child) && child.name === "outline") {
      // Check if the outline element has nested outline elements
      if (child.children.some((nestedChild) => isXmlElement(nestedChild) && nestedChild.name === "outline")) {
        // Add nested outline elements to the array
        outlines.push(
          ...child.children.filter(
            (nestedChild): nestedChild is XmlElement => isXmlElement(nestedChild) && nestedChild.name === "outline",
          ),
        );
      } else {
        // Add the outline element itself to the array
        outlines.push(child);
      }
    }
  });

  const feeds: string[] = outlines.map((item) => item.attributes["xmlUrl"]);

  return feeds;
}
