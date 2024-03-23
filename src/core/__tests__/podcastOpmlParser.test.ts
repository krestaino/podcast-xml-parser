import fetchMock from "jest-fetch-mock";

import { podcastOpmlParser } from "../../";
import { ERROR_MESSAGES } from "../../constants";
import { transformOpml } from "../../transform";

jest.mock("../../transform", () => ({
  transformOpml: jest.fn(),
}));

fetchMock.enableMocks();

describe("podcastOpmlParser", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    (transformOpml as jest.Mock).mockReset();
  });

  it("should parse and return an array of feed URLs from a URL source", async () => {
    const mockFeedContent = "<opml>Podcast OPML</opml>";
    const mockFeeds = ["https://example.com/feed1.xml", "https://example.com/feed2.xml"];
    fetchMock.mockResponseOnce(mockFeedContent);
    (transformOpml as jest.Mock).mockReturnValue(mockFeeds);

    const url = new URL("https://example.com/podcast.opml");
    const result = await podcastOpmlParser(url);

    expect(result).toEqual(mockFeeds);
    expect(fetch).toHaveBeenCalledWith(url.toString());
    expect(transformOpml).toHaveBeenCalledWith(mockFeedContent);
  });

  it("should parse and return an array of feed URLs from an XML string source", async () => {
    const mockXmlString = "<opml>Podcast OPML</opml>";
    const mockFeeds = ["https://example.com/feed1.xml", "https://example.com/feed2.xml"];
    (transformOpml as jest.Mock).mockReturnValue(mockFeeds);

    const result = await podcastOpmlParser(mockXmlString);

    expect(result).toEqual(mockFeeds);
    expect(transformOpml).toHaveBeenCalledWith(mockXmlString);
  });

  it("should throw an error if the source type is invalid", async () => {
    const invalidSource = 123;

    await expect(podcastOpmlParser(invalidSource as unknown as URL | string)).rejects.toThrow(
      ERROR_MESSAGES.OPML_INVALID_SOURCE,
    );
  });

  it("should throw an error if no feed is available to parse", async () => {
    fetchMock.mockResponseOnce("");
    const url = new URL("https://example.com/podcast.opml");

    await expect(podcastOpmlParser(url)).rejects.toThrow(ERROR_MESSAGES.OPML_NO_FEED_TO_PARSE);
  });

  it("should throw an error if the fetch request fails", async () => {
    fetchMock.mockResponseOnce("", { status: 404 });
    const url = new URL("https://example.com/podcast.opml");

    await expect(podcastOpmlParser(url)).rejects.toThrow(ERROR_MESSAGES.FETCH_FAILED);
  });
});
