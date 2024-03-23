import fetchMock from "jest-fetch-mock";

import { podcastXmlParser } from "../../";
import { ERROR_MESSAGES } from "../../constants";
import { fetchItunes, fetchPodcast, parseXml, transformPodcast } from "../../utils";

jest.mock("../../utils", () => ({
  fetchPodcast: jest.fn(),
  fetchItunes: jest.fn(),
  parseXml: jest.fn(),
  transformPodcast: jest.fn(),
}));

fetchMock.enableMocks();

describe("podcastXmlParser", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    (fetchPodcast as jest.Mock).mockReset();
    (fetchItunes as jest.Mock).mockReset();
    (parseXml as jest.Mock).mockReset();
    (transformPodcast as jest.Mock).mockReset();
  });

  it("should parse and return podcast data from a URL source", async () => {
    const mockFeedContent = "<xml>Podcast Feed</xml>";
    const mockPodcast = { title: "Test Podcast", feedUrl: "https://example.com/feed.xml" };
    const mockEpisodes = [{ title: "Episode 1" }];
    (fetchPodcast as jest.Mock).mockResolvedValue(mockFeedContent);
    (parseXml as jest.Mock).mockReturnValue({});
    (transformPodcast as jest.Mock).mockReturnValue({ podcast: mockPodcast, episodes: mockEpisodes });

    const url = new URL("https://example.com/podcast.xml");
    const result = await podcastXmlParser(url);

    expect(result).toEqual({ podcast: mockPodcast, episodes: mockEpisodes, itunes: undefined });
    expect(fetchPodcast).toHaveBeenCalledWith(url, {});
    expect(parseXml).toHaveBeenCalledWith(mockFeedContent);
    expect(transformPodcast).toHaveBeenCalledWith({});
  });

  it("should parse and return podcast data from an iTunes ID source", async () => {
    const mockItunes = { feedUrl: "https://example.com/feed.xml" };
    const mockFeedContent = "<xml>Podcast Feed</xml>";
    const mockPodcast = { title: "Test Podcast", feedUrl: "https://example.com/feed.xml" };
    const mockEpisodes = [{ title: "Episode 1" }];
    (fetchItunes as jest.Mock).mockResolvedValue(mockItunes);
    (fetchPodcast as jest.Mock).mockResolvedValue(mockFeedContent);
    (parseXml as jest.Mock).mockReturnValue({});
    (transformPodcast as jest.Mock).mockReturnValue({ podcast: mockPodcast, episodes: mockEpisodes });

    const itunesId = 123456;
    const result = await podcastXmlParser(itunesId);

    expect(result).toEqual({ podcast: mockPodcast, episodes: mockEpisodes, itunes: mockItunes });
    expect(fetchItunes).toHaveBeenCalledWith(itunesId);
    expect(fetchPodcast).toHaveBeenCalledWith(new URL(mockItunes.feedUrl), {});
    expect(parseXml).toHaveBeenCalledWith(mockFeedContent);
    expect(transformPodcast).toHaveBeenCalledWith({});
  });

  it("should parse and return podcast data from an XML string source", async () => {
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

  it("should fetch iTunes information if config.itunes is true and iTunes data is not already available", async () => {
    const mockFeedContent = "<xml>Podcast Feed</xml>";
    const mockPodcast = { title: "Test Podcast", feedUrl: "https://example.com/feed.xml" };
    const mockEpisodes = [{ title: "Episode 1" }];
    const mockItunes = { feedUrl: "https://example.com/feed.xml", title: "Test Podcast" };
    (fetchPodcast as jest.Mock).mockResolvedValue(mockFeedContent);
    (parseXml as jest.Mock).mockReturnValue({});
    (transformPodcast as jest.Mock).mockReturnValue({ podcast: mockPodcast, episodes: mockEpisodes });
    (fetchItunes as jest.Mock).mockResolvedValue(mockItunes);

    const url = new URL("https://example.com/podcast.xml");
    const result = await podcastXmlParser(url, { itunes: true });

    expect(result).toEqual({ podcast: mockPodcast, episodes: mockEpisodes, itunes: mockItunes });
    expect(fetchPodcast).toHaveBeenCalledWith(url, { itunes: true });
    expect(parseXml).toHaveBeenCalledWith(mockFeedContent);
    expect(transformPodcast).toHaveBeenCalledWith({});
    expect(fetchItunes).toHaveBeenCalledWith(mockPodcast.title, mockPodcast.feedUrl);
  });

  it("should throw an error if the source type is invalid", async () => {
    const invalidSource = {};

    await expect(podcastXmlParser(invalidSource as unknown as URL | number | string)).rejects.toThrow(
      ERROR_MESSAGES.XML_INVALID_SOURCE,
    );
  });

  it("should throw an error if no feed is available to parse", async () => {
    fetchMock.mockResponseOnce("");
    const url = new URL("https://example.com/podcast.xml");

    await expect(podcastXmlParser(url)).rejects.toThrow(ERROR_MESSAGES.XML_NO_FEED_TO_PARSE);
  });

  it("should throw an error if the feed URL cannot be retrieved from iTunes", async () => {
    const itunesId = 123456;
    (fetchItunes as jest.Mock).mockResolvedValue(undefined);

    await expect(podcastXmlParser(itunesId)).rejects.toThrow(ERROR_MESSAGES.ITUNES_NO_FEED_URL);
  });

  it("should paginate episodes based on config options", async () => {
    const mockFeedContent = "<xml>Podcast Feed</xml>";
    const mockPodcast = { title: "Test Podcast", feedUrl: "https://example.com/feed.xml" };
    const allEpisodes = Array.from({ length: 20 }, (_, i) => ({ title: `Episode ${i + 1}` }));
    (fetchPodcast as jest.Mock).mockResolvedValue(mockFeedContent);
    (parseXml as jest.Mock).mockReturnValue({});
    (transformPodcast as jest.Mock).mockReturnValue({ podcast: mockPodcast, episodes: allEpisodes });

    const url = new URL("https://example.com/podcast.xml");
    const config = { start: 5, limit: 5 };
    const result = await podcastXmlParser(url, config);

    expect(result.episodes).toEqual(allEpisodes.slice(5, 10));
    expect(fetchPodcast).toHaveBeenCalledWith(url, config);
    expect(parseXml).toHaveBeenCalledWith(mockFeedContent);
    expect(transformPodcast).toHaveBeenCalledWith({});
  });
});
