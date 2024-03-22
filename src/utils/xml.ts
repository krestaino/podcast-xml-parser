import { parseXml, XmlDocument, XmlElement, XmlNode, XmlText } from "@rgrove/parse-xml";

export function isXmlElement(node: XmlNode): node is XmlElement {
  return node.type === "element";
}

export function isXmlText(node: XmlNode): node is XmlText {
  return node.type === "text";
}

export function getXmlElement(element: XmlElement, name: string): XmlElement | undefined {
  return element.children.find(
    (child: XmlNode): child is XmlElement => isXmlElement(child) && child.name === name,
  );
}

export function getTextValue(element: XmlElement, name: string): string {
  const foundElement = getXmlElement(element, name);
  return foundElement ? foundElement.children.find(isXmlText)?.text || "" : "";
}

export function getAttributeValue(element: XmlElement, name: string, attribute: string): string {
  const foundElement = getXmlElement(element, name);
  return foundElement ? foundElement.attributes[attribute] || "" : "";
}

/**
 * Parses the provided XML text into a JavaScript object.
 * @param xmlText The XML text to parse.
 * @returns A JavaScript object representation of the XML.
 */
export function parsePodcastXML(xmlText: string): XmlDocument {
  return parseXml(xmlText);
}
