import fetchMock from "jest-fetch-mock";
import { DOMParser, XMLSerializer } from "xmldom";

import { fetchXmlFromUrl, removeItemsFromDocument } from "../src/xml";
import { USER_AGENT } from "../src/constants";

fetchMock.enableMocks();
const parser = new DOMParser();

describe("xml.test.ts", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should set the User-Agent header correctly", async () => {
    const testUrl = "https://example.com/feed.xml";
    const testConfig = {
      requestHeaders: {
        "Custom-Header": "CustomValue",
      },
    };

    fetchMock.mockResponseOnce("<rss></rss>");

    await fetchXmlFromUrl(testUrl, testConfig);

    expect(fetchMock).toHaveBeenCalledWith(testUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Custom-Header": "CustomValue",
      },
    });
  });

  it("should set the Range header correctly if requestSize is specified", async () => {
    const testUrl = "https://example.com/feed.xml";
    const testConfig = { requestSize: 5000 };

    fetchMock.mockResponseOnce("<rss></rss>");

    await fetchXmlFromUrl(testUrl, testConfig);

    expect(fetchMock).toHaveBeenCalledWith(testUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Range: "bytes=0-5000",
      },
    });
  });

  it("should use the default User-Agent if none is provided", async () => {
    const testUrl = "https://example.com/feed.xml";
    const testConfig = {
      requestHeaders: {},
    };

    fetchMock.mockResponseOnce("<rss></rss>");

    await fetchXmlFromUrl(testUrl, testConfig);

    expect(fetchMock).toHaveBeenCalledWith(testUrl, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
  });

  it("should use the default User-Agent if an empty string is provided", async () => {
    const testUrl = "https://example.com/feed.xml";
    const testConfig = {
      requestHeaders: {
        "User-Agent": "",
      },
    };

    fetchMock.mockResponseOnce("<rss></rss>");

    await fetchXmlFromUrl(testUrl, testConfig);

    expect(fetchMock).toHaveBeenCalledWith(testUrl, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
  });

  it('should remove all <item> elements from the document', () => {
    const xmlString = `
      <rss>
        <channel>
          <title>Test Podcast</title>
          <item><title>Episode 1</title></item>
          <item><title>Episode 2</title></item>
        </channel>
      </rss>
    `;
    const document = parser.parseFromString(xmlString);

    // Check the number of <item> elements before removal
    expect(document.getElementsByTagName("item").length).toBe(2);

    const modifiedDocument = removeItemsFromDocument(document);

    // Check the number of <item> elements after removal
    expect(modifiedDocument.getElementsByTagName("item").length).toBe(0);

    const modifiedXmlString = new XMLSerializer().serializeToString(modifiedDocument);
    expect(modifiedXmlString).not.toContain('<item>');
    expect(modifiedXmlString).toContain('<title>Test Podcast</title>');
  });  
});
