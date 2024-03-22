import { XmlDocument, XmlElement, XmlText, parseXml } from "@rgrove/parse-xml";
import {
  isXmlElement,
  isXmlText,
  getXmlElement,
  getTextValue,
  getAttributeValue,
  parsePodcastXML,
} from "../xml";

describe("xmlUtils", () => {
  const sampleXml = `
    <root>
      <child id="1">Hello</child>
      <child id="2">World</child>
    </root>
  `;

  const parsedXml = parseXml(sampleXml);

  describe("isXmlElement", () => {
    it("should return true for XmlElement", () => {
      const element = parsedXml.children[0];
      expect(isXmlElement(element)).toBe(true);
    });

    it("should return false for non-XmlElement", () => {
      const textNode = { type: "text", text: "Hello" } as XmlText;
      expect(isXmlElement(textNode)).toBe(false);
    });
  });

  describe("isXmlText", () => {
    it("should return true for XmlText", () => {
      const textNode = { type: "text", text: "Hello" } as XmlText;
      expect(isXmlText(textNode)).toBe(true);
    });

    it("should return false for non-XmlText", () => {
      const element = parsedXml.children[0];
      expect(isXmlText(element)).toBe(false);
    });
  });

  describe("getXmlElement", () => {
    it("should return the correct XmlElement", () => {
      const root = parsedXml.children[0] as XmlElement;
      const child = getXmlElement(root, "child") as XmlElement;
      expect(child).toBeDefined();
      expect(child.name).toBe("child");
    });

    it("should return undefined for non-existent element", () => {
      const root = parsedXml.children[0] as XmlElement;
      const child = getXmlElement(root, "nonexistent");
      expect(child).toBeUndefined();
    });
  });

  describe("getTextValue", () => {
    it("should return the correct text value", () => {
      const root = parsedXml.children[0] as XmlElement;
      const text = getTextValue(root, "child");
      expect(text).toBe("Hello");
    });

    it("should return an empty string for non-existent element", () => {
      const root = parsedXml.children[0] as XmlElement;
      const text = getTextValue(root, "nonexistent");
      expect(text).toBe("");
    });

    it("should return an empty string if the element has no text child", () => {
      const xmlWithNoTextChild = `
        <root>
          <child id="1"><subchild></subchild></child>
        </root>
      `;
      const parsedXmlWithNoTextChild = parseXml(xmlWithNoTextChild) as XmlDocument;
      const root = parsedXmlWithNoTextChild.children[0] as XmlElement;
      const text = getTextValue(root, "child");
      expect(text).toBe("");
    });
  });

  describe("getAttributeValue", () => {
    it("should return the correct attribute value", () => {
      const root = parsedXml.children[0] as XmlElement;
      const value = getAttributeValue(root, "child", "id");
      expect(value).toBe("1");
    });

    it("should return an empty string for non-existent attribute", () => {
      const root = parsedXml.children[0] as XmlElement;
      const value = getAttributeValue(root, "child", "nonexistent");
      expect(value).toBe("");
    });

    it("should return an empty string if the element is not found", () => {
      const root = parsedXml.children[0] as XmlElement;
      const value = getAttributeValue(root, "nonexistent", "id");
      expect(value).toBe("");
    });
  });

  describe("parsePodcastXML", () => {
    it("should parse XML text into a JavaScript object", () => {
      const xmlObject = parsePodcastXML(sampleXml);
      expect(xmlObject).toBeDefined();
      expect(xmlObject.type).toBe("document");
    });
  });
});
