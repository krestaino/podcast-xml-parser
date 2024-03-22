import { parseXml, XmlDocument, XmlElement, XmlNode, XmlText } from "@rgrove/parse-xml";

/**
 * Checks if a given XML node is an XmlElement.
 * @param node The XML node to check.
 * @returns True if the node is an XmlElement, false otherwise.
 */
export function isXmlElement(node: XmlNode): node is XmlElement {
  return node.type === "element";
}

/**
 * Checks if a given XML node is an XmlText.
 * @param node The XML node to check.
 * @returns True if the node is an XmlText, false otherwise.
 */
export function isXmlText(node: XmlNode): node is XmlText {
  return node.type === "text";
}

/**
 * Retrieves an XmlElement child with a specific name from a given XmlElement.
 * @param element The parent XmlElement to search in.
 * @param name The name of the child XmlElement to find.
 * @returns The found XmlElement, or undefined if not found.
 */
export function getXmlElement(element: XmlElement, name: string): XmlElement | undefined {
  return element.children.find((child: XmlNode): child is XmlElement => isXmlElement(child) && child.name === name);
}

/**
 * Retrieves the text value of a child XmlElement with a specific name from a given XmlElement.
 * @param element The parent XmlElement to search in.
 * @param name The name of the child XmlElement whose text value is to be retrieved.
 * @returns The text value of the found XmlElement, or an empty string if not found.
 */
export function getTextValue(element: XmlElement | undefined, name: string): string {
  if (element === undefined) {
    return "";
  }

  const foundElement = getXmlElement(element, name);
  return foundElement ? foundElement.children.find(isXmlText)?.text || "" : "";
}

/**
 * Retrieves the value of a specific attribute from a child XmlElement with a specific name.
 * @param element The parent XmlElement to search in.
 * @param name The name of the child XmlElement whose attribute value is to be retrieved.
 * @param attribute The name of the attribute whose value is to be retrieved.
 * @returns The value of the attribute, or an empty string if not found.
 */
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
