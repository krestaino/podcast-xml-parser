import fetchMock from "jest-fetch-mock";

import { fetchXmlFromUrl } from "../src/xml";
import { USER_AGENT } from "../src/constants";

fetchMock.enableMocks();

describe("fetchXmlFromUrl", () => {
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
});
