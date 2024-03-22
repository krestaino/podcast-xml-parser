import fetchMock from "jest-fetch-mock";
import { podcastXmlParser } from "../podcastXmlParser";
import { ERROR_MESSAGES } from "../constants";
import { fetchData, fetchItunes, parseXml, transformPodcast } from "../utils";

jest.mock("../utils", () => ({
  fetchData: jest.fn(),
  fetchItunes: jest.fn(),
  parseXml: jest.fn(),
  transformPodcast: jest.fn(),
}));

fetchMock.enableMocks();

describe("podcastXmlParser", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    (fetchData as jest.Mock).mockReset();
    (fetchItunes as jest.Mock).mockReset();
    (parseXml as jest.Mock).mockReset();
    (transformPodcast as jest.Mock).mockReset();
  });

  it("should parse and return podcast data from a URL input", async () => {
    const mockFeedContent = "<xml>Podcast Feed</xml>";
    const mockPodcast = { title: "Test Podcast", feedUrl: "https://example.com/feed.xml" };
    const mockEpisodes = [{ title: "Episode 1" }];
    (fetchData as jest.Mock).mockResolvedValue(mockFeedContent);
    (parseXml as jest.Mock).mockReturnValue({});
    (transformPodcast as jest.Mock).mockReturnValue({ podcast: mockPodcast, episodes: mockEpisodes });

    const url = new URL("https://example.com/podcast.xml");
    const result = await podcastXmlParser(url);

    expect(result).toEqual({ podcast: mockPodcast, episodes: mockEpisodes, itunes: undefined });
    expect(fetchData).toHaveBeenCalledWith(url);
    expect(parseXml).toHaveBeenCalledWith(mockFeedContent);
    expect(transformPodcast).toHaveBeenCalledWith({});
  });

  it("should parse and return podcast data from an iTunes ID input", async () => {
    const mockItunes = { feedUrl: "https://example.com/feed.xml" };
    const mockFeedContent = "<xml>Podcast Feed</xml>";
    const mockPodcast = { title: "Test Podcast", feedUrl: "https://example.com/feed.xml" };
    const mockEpisodes = [{ title: "Episode 1" }];
    (fetchItunes as jest.Mock).mockResolvedValue(mockItunes);
    (fetchData as jest.Mock).mockResolvedValue(mockFeedContent);
    (parseXml as jest.Mock).mockReturnValue({});
    (transformPodcast as jest.Mock).mockReturnValue({ podcast: mockPodcast, episodes: mockEpisodes });

    const itunesId = 123456;
    const result = await podcastXmlParser(itunesId);

    expect(result).toEqual({ podcast: mockPodcast, episodes: mockEpisodes, itunes: mockItunes });
    expect(fetchItunes).toHaveBeenCalledWith(itunesId);
    expect(fetchData).toHaveBeenCalledWith(new URL(mockItunes.feedUrl));
    expect(parseXml).toHaveBeenCalledWith(mockFeedContent);
    expect(transformPodcast).toHaveBeenCalledWith({});
  });

  it("should parse and return podcast data from an XML string input", async () => {
    const mockXmlString = "<xml>Podcast Feed</xml>";
    const mockPodcast = { title: "Test Podcast", feedUrl: "https://example.com/feed.xml" };
    const mockEpisodes = [{ title: "Episode 1" }];
    (parseXml as jest.Mock).mockReturnValue({});
    (transformPodcast as jest.Mock).mockReturnValue({ podcast: mockPodcast, episodes: mockEpisodes });

    const result = await podcastXmlParser(mockXmlString);

    expect(result).toEqual({ podcast: mockPodcast, episodes: mockEpisodes, itunes: undefined });
    expect(parseXml).toHaveBeenCalledWith(mockXmlString);
    expect(transformPodcast).toHaveBeenCalledWith({});
  });

  it("should throw an error if the input type is invalid", async () => {
    const invalidInput = {};

    await expect(podcastXmlParser(invalidInput as unknown as URL | number | string)).rejects.toThrow(
      ERROR_MESSAGES.INVALID_INPUT,
    );
  });

  it("should throw an error if no feed is available to parse", async () => {
    fetchMock.mockResponseOnce("");
    const url = new URL("https://example.com/podcast.xml");

    await expect(podcastXmlParser(url)).rejects.toThrow(ERROR_MESSAGES.NO_FEED_TO_PARSE);
  });

  it("should throw an error if the feed URL cannot be retrieved from iTunes", async () => {
    const itunesId = 123456;
    (fetchItunes as jest.Mock).mockResolvedValue(undefined);

    await expect(podcastXmlParser(itunesId)).rejects.toThrow(ERROR_MESSAGES.ITUNES_NO_FEED_URL);
  });
});
