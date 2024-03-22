import fetchMock from "jest-fetch-mock";
import { fetchData } from "../fetch";
import { ERROR_MESSAGES } from "../constants";

describe("fetchPodcastFeed", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should fetch and return the podcast feed content", async () => {
    const mockFeedContent = "<xml>Podcast Feed</xml>";
    fetchMock.mockResponseOnce(mockFeedContent);

    const url = new URL("https://example.com/podcast.xml");
    const result = await fetchData(url);

    expect(result).toEqual(mockFeedContent);
    expect(fetchMock).toHaveBeenCalledWith(url.toString());
  });

  it("should throw an error if the fetch request fails", async () => {
    fetchMock.mockReject(new Error("Network error"));

    const url = new URL("https://example.com/podcast.xml");
    await expect(fetchData(url)).rejects.toThrow("Network error");
  });

  it("should throw an error if the response is not ok", async () => {
    const mockStatusText = "Not Found";
    fetchMock.mockResponseOnce("", {
      status: 404,
      statusText: mockStatusText,
    });

    const url = new URL("https://example.com/podcast.xml");
    await expect(fetchData(url)).rejects.toThrow(ERROR_MESSAGES.FETCH_FAILED);
  });
});
