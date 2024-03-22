import fetchMock from "jest-fetch-mock";
import { fetchPodcastFeed, fetchItunes } from "../fetch";

describe("fetchPodcastFeed", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch and return the podcast feed content", async () => {
    const mockFeedContent = "<xml>Podcast Feed</xml>";
    fetchMock.mockResponseOnce(mockFeedContent);

    const url = new URL("https://example.com/podcast.xml");
    const result = await fetchPodcastFeed(url);

    expect(result).toEqual(mockFeedContent);
    expect(fetchMock).toHaveBeenCalledWith(url.toString());
  });

  it("should throw an error if the fetch request fails", async () => {
    fetchMock.mockReject(new Error("Network error"));

    const url = new URL("https://example.com/podcast.xml");
    await expect(fetchPodcastFeed(url)).rejects.toThrow("Network error");
  });

  it("should throw an error if the response is not ok", async () => {
    const mockStatusText = "Not Found";
    fetchMock.mockResponseOnce("", {
      status: 404,
      statusText: mockStatusText,
    });

    const url = new URL("https://example.com/podcast.xml");
    await expect(fetchPodcastFeed(url)).rejects.toThrow(
      `Failed to fetch podcast feed from ${url}: ${mockStatusText}`,
    );
  });
});

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
    expect(fetchMock).toHaveBeenCalledWith(
      "https://itunes.apple.com/lookup?id=12345&entity=podcast",
    );
  });

  it("should fetch and return the podcast data using search term", async () => {
    const mockData = {
      resultCount: 1,
      results: [{ collectionName: "Test Podcast", feedUrl: "https://example.com/feed" }],
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await fetchItunes("Test Podcast");

    expect(result).toEqual(mockData.results[0]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://itunes.apple.com/search?term=Test%20Podcast&entity=podcast",
    );
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

  it("should throw an error if no podcast is found", async () => {
    const mockData = { resultCount: 0, results: [] };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    await expect(fetchItunes("Nonexistent Podcast")).rejects.toThrow(
      "No podcast found for Nonexistent Podcast",
    );
  });

  it("should throw an error if no matching podcast is found with the provided feed URL", async () => {
    const mockData = {
      resultCount: 1,
      results: [{ collectionId: 123, feedUrl: "https://example.com/non-matching-feed" }],
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    await expect(fetchItunes("Test Podcast", "https://example.com/matching-feed")).rejects.toThrow(
      "No matching podcast found for Test Podcast",
    );
  });

  it("should throw an error if the fetch request fails", async () => {
    fetchMock.mockReject(new Error("Network error"));

    await expect(fetchItunes(12345)).rejects.toThrow("Network error");
  });

  it("should throw an error if the response is not ok", async () => {
    const mockStatusText = "Not Found";
    fetchMock.mockResponseOnce("", {
      status: 404,
      statusText: mockStatusText,
    });

    await expect(fetchItunes(12345)).rejects.toThrow(
      `Failed to fetch iTunes data for 12345: ${mockStatusText}`,
    );
  });
});
