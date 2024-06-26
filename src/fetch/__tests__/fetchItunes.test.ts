import fetchMock from "jest-fetch-mock";

import { fetchItunes } from "../fetchItunes";

fetchMock.enableMocks();

describe("fetchItunes", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch and return the podcast data using iTunes ID", async () => {
    const mockData = {
      resultCount: 1,
      results: [{ collectionId: 12345, feedUrl: "https://example.com/feed" }],
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await fetchItunes(12345);

    expect(result).toEqual(mockData.results[0]);
    expect(fetchMock).toHaveBeenCalledWith("https://itunes.apple.com/lookup?id=12345&entity=podcast");
  });

  it("should fetch and return the podcast data using search term", async () => {
    const mockData = {
      resultCount: 1,
      results: [{ collectionName: "Test Podcast", feedUrl: "https://example.com/feed" }],
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await fetchItunes("Test Podcast", "https://example.com/feed");

    expect(result).toEqual(mockData.results[0]);
    expect(fetchMock).toHaveBeenCalledWith("https://itunes.apple.com/search?term=Test%20Podcast&entity=podcast");
  });

  it("should return the matching podcast when provided with a feed URL", async () => {
    const mockData = {
      resultCount: 2,
      results: [
        { collectionId: 123, feedUrl: "https://example.com/other-feed" },
        { collectionId: 456, feedUrl: "https://example.com/matching-feed" },
      ],
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await fetchItunes("Test Podcast", "https://example.com/matching-feed");

    expect(result).toEqual(mockData.results[1]);
  });

  it("should return undefined if no matching podcast is found with the provided feed URL", async () => {
    const mockData = {
      resultCount: 1,
      results: [{ collectionId: 123, feedUrl: "https://example.com/non-matching-feed" }],
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await fetchItunes("Test Podcast", "https://example.com/matching-feed");

    expect(result).toBeUndefined();
  });

  it("should return undefined if the response is not ok", async () => {
    const mockStatusText = "Not Found";
    fetchMock.mockResponseOnce("", { status: 404, statusText: mockStatusText });

    const result = await fetchItunes(12345);

    expect(result).toBeUndefined();
  });
});
