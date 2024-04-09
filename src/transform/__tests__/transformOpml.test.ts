import { transformOpml } from "../transformOpml";
import { parseXml } from "../../utils";

jest.mock("../../utils", () => ({
  parseXml: jest.fn(),
}));

describe("transformOpml", () => {
  beforeEach(() => {
    (parseXml as jest.Mock).mockReset();
  });

  it("should extract feed URLs and titles from OPML XML data with multiple outlines", () => {
    const xmlText =
      '<opml><body><outline text="Feed 1" xmlUrl="https://example.com/feed1.xml"/><outline text="Feed 2" xmlUrl="https://example.com/feed2.xml"/></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: [
            { "@_text": "Feed 1", "@_xmlUrl": "https://example.com/feed1.xml" },
            { "@_text": "Feed 2", "@_xmlUrl": "https://example.com/feed2.xml" },
          ],
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual([
      { title: "Feed 1", url: "https://example.com/feed1.xml" },
      { title: "Feed 2", url: "https://example.com/feed2.xml" },
    ]);
  });

  it("should extract feed URL and title from OPML XML data with a single outline", () => {
    const xmlText = '<opml><body><outline text="Feed" xmlUrl="https://example.com/feed.xml"/></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: { "@_text": "Feed", "@_xmlUrl": "https://example.com/feed.xml" },
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual([{ title: "Feed", url: "https://example.com/feed.xml" }]);
  });

  it("should extract feed URLs and titles from nested outlines", () => {
    const xmlText =
      '<opml><body><outline><outline text="Feed 1" xmlUrl="https://example.com/feed1.xml"/><outline text="Feed 2" xmlUrl="https://example.com/feed2.xml"/></outline></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: {
            outline: [
              { "@_text": "Feed 1", "@_xmlUrl": "https://example.com/feed1.xml" },
              { "@_text": "Feed 2", "@_xmlUrl": "https://example.com/feed2.xml" },
            ],
          },
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual([
      { title: "Feed 1", url: "https://example.com/feed1.xml" },
      { title: "Feed 2", url: "https://example.com/feed2.xml" },
    ]);
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

  it("should filter out outlines without URLs", () => {
    const xmlText =
      '<opml><body><outline text="Feed 1" xmlUrl="https://example.com/feed1.xml"/><outline text="Feed 2"/></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: [{ "@_text": "Feed 1", "@_xmlUrl": "https://example.com/feed1.xml" }, { "@_text": "Feed 2" }],
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual([{ title: "Feed 1", url: "https://example.com/feed1.xml" }]);
  });

  it("should extract feed URL and title from OPML XML data with a single outline nested inside an outline container", () => {
    const xmlText =
      '<opml><body><outline><outline text="Feed" xmlUrl="https://example.com/feed.xml"/></outline></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: {
            outline: { "@_text": "Feed", "@_xmlUrl": "https://example.com/feed.xml" },
          },
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual([{ title: "Feed", url: "https://example.com/feed.xml" }]);
  });

  it("should extract feed URLs and titles from OPML XML data with multiple outlines nested inside an outline container", () => {
    const xmlText =
      '<opml><body><outline><outline text="Feed 1" xmlUrl="https://example.com/feed1.xml"/><outline text="Feed 2" xmlUrl="https://example.com/feed2.xml"/></outline></body></opml>';
    const parsedXml = {
      opml: {
        body: {
          outline: {
            outline: [
              { "@_text": "Feed 1", "@_xmlUrl": "https://example.com/feed1.xml" },
              { "@_text": "Feed 2", "@_xmlUrl": "https://example.com/feed2.xml" },
            ],
          },
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformOpml(xmlText);

    expect(result).toEqual([
      { title: "Feed 1", url: "https://example.com/feed1.xml" },
      { title: "Feed 2", url: "https://example.com/feed2.xml" },
    ]);
  });
});
