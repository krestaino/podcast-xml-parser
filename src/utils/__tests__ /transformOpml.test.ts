import { parseXml } from "../parseXml";
import { transformOpml } from "../transformOpml";

jest.mock("../parseXml", () => ({
  parseXml: jest.fn(),
}));

describe("transformOpml", () => {
  beforeEach(() => {
    (parseXml as jest.Mock).mockReset();
  });

  it("should extract feed URLs from OPML XML data with multiple outlines", () => {
    const xmlText =
      '<opml><body><outline xmlUrl="https://example.com/feed1.xml"/><outline xmlUrl="https://example.com/feed2.xml"/></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: [{ "@_xmlUrl": "https://example.com/feed1.xml" }, { "@_xmlUrl": "https://example.com/feed2.xml" }],
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual(["https://example.com/feed1.xml", "https://example.com/feed2.xml"]);
  });

  it("should extract feed URL from OPML XML data with a single outline", () => {
    const xmlText = '<opml><body><outline xmlUrl="https://example.com/feed.xml"/></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: { "@_xmlUrl": "https://example.com/feed.xml" },
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual(["https://example.com/feed.xml"]);
  });

  it("should extract feed URLs from nested outlines", () => {
    const xmlText =
      '<opml><body><outline><outline xmlUrl="https://example.com/feed1.xml"/><outline xmlUrl="https://example.com/feed2.xml"/></outline></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: {
            outline: [{ "@_xmlUrl": "https://example.com/feed1.xml" }, { "@_xmlUrl": "https://example.com/feed2.xml" }],
          },
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual(["https://example.com/feed1.xml", "https://example.com/feed2.xml"]);
  });

  it("should handle empty outlines", () => {
    const xmlText = "<opml><body></body></opml>";
    const parsedXml = {
      opml: {
        body: {},
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual([]);
  });

  it("should throw an error if the expected XML structure is not found", () => {
    const xmlText = "<invalid></invalid>";
    const parsedXml = {};
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    expect(() => transformOpml(xmlText)).toThrow("Expected XML structure not found");
  });

  it("should filter out undefined URLs", () => {
    const xmlText = '<opml><body><outline xmlUrl="https://example.com/feed1.xml"/><outline/></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: [{ "@_xmlUrl": "https://example.com/feed1.xml" }, {}],
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual(["https://example.com/feed1.xml"]);
  });

  it("should extract feed URL from OPML XML data with a single outline nested inside an outline container", () => {
    const xmlText = '<opml><body><outline><outline xmlUrl="https://example.com/feed.xml"/></outline></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: {
            outline: { "@_xmlUrl": "https://example.com/feed.xml" },
          },
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual(["https://example.com/feed.xml"]);
  });

  it("should extract feed URLs from OPML XML data with multiple outlines nested inside an outline container", () => {
    const xmlText =
      '<opml><body><outline><outline xmlUrl="https://example.com/feed1.xml"/><outline xmlUrl="https://example.com/feed2.xml"/></outline></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: {
            outline: [{ "@_xmlUrl": "https://example.com/feed1.xml" }, { "@_xmlUrl": "https://example.com/feed2.xml" }],
          },
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual(["https://example.com/feed1.xml", "https://example.com/feed2.xml"]);
  });
});
