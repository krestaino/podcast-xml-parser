import { transformPodcast } from "../transformPodcast";
import { getDuration, parseXml } from "../../utils";

jest.mock("../../utils", () => ({
  getDuration: jest.fn(),
  parseXml: jest.fn(),
}));

describe("transformPodcast", () => {
  beforeEach(() => {
    (parseXml as jest.Mock).mockReset();
    (getDuration as jest.Mock).mockReset();
    (getDuration as jest.Mock).mockImplementation((duration) => (duration ? parseInt(duration, 10) : 0));
  });

  it("should handle null or undefined rss or channel objects", () => {
    const xmlText = `<rss></rss>`;
    const parsedXml = {
      rss: null,
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformPodcast(xmlText);

    expect(result.podcast.feedUrl).toEqual("");
  });

  it("should extract feedUrl from atom:link", () => {
    const xmlText = `
      <rss>
        <channel>
          <title>Podcast Title</title>
          <link>http://example.com</link>
          <atom:link href="http://example.com/feed" rel="self" type="application/rss+xml" />
          <description>Podcast Description</description>
        </channel>
      </rss>
    `;
    const parsedXml = {
      rss: {
        channel: {
          title: "Podcast Title",
          link: "http://example.com",
          "atom:link": {
            "@_href": "http://example.com/feed",
            "@_rel": "self",
            "@_type": "application/rss+xml",
          },
          description: "Podcast Description",
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformPodcast(xmlText);

    expect(result.podcast.feedUrl).toEqual("http://example.com/feed");
  });

  it("should extract feedUrl from an array of atom:link elements", () => {
    const xmlText = `
      <rss>
        <channel>
          <title>Podcast Title</title>
          <link>http://example.com</link>
          <atom:link href="http://example.com/other" rel="alternate" type="text/html" />
          <atom:link href="http://example.com/feed" rel="self" type="application/rss+xml" />
          <description>Podcast Description</description>
        </channel>
      </rss>
    `;
    const parsedXml = {
      rss: {
        channel: {
          title: "Podcast Title",
          link: "http://example.com",
          "atom:link": [
            {
              "@_href": "http://example.com/other",
              "@_rel": "alternate",
              "@_type": "text/html",
            },
            {
              "@_href": "http://example.com/feed",
              "@_rel": "self",
              "@_type": "application/rss+xml",
            },
          ],
          description: "Podcast Description",
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformPodcast(xmlText);

    expect(result.podcast.feedUrl).toEqual("http://example.com/feed");
  });

  it("should transform parsed XML data into a Podcast object with episodes", () => {
    const xmlText = `
      <rss>
        <channel>
          <title>Podcast Title</title>
          <link>http://example.com</link>
          <description>Podcast Description</description>
          <item>
            <title>Episode 1</title>
            <description>Episode 1 Description</description>
            <enclosure url="http://example.com/episode1.mp3" />
            <itunes:duration>600</itunes:duration>
          </item>
          <item>
            <title>Episode 2</title>
            <description>Episode 2 Description</description>
            <enclosure url="http://example.com/episode2.mp3" />
            <itunes:duration>1200</itunes:duration>
          </item>
        </channel>
      </rss>
    `;
    const parsedXml = {
      rss: {
        channel: {
          title: "Podcast Title",
          link: "http://example.com",
          description: "Podcast Description",
          item: [
            {
              title: "Episode 1",
              description: "Episode 1 Description",
              enclosure: {
                "@_url": "http://example.com/episode1.mp3",
              },
              "itunes:duration": "600",
            },
            {
              title: "Episode 2",
              description: "Episode 2 Description",
              enclosure: {
                "@_url": "http://example.com/episode2.mp3",
              },
              "itunes:duration": "1200",
            },
          ],
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformPodcast(xmlText);

    expect(result.podcast.title).toEqual("Podcast Title");
    expect(result.podcast.link).toEqual("http://example.com");
    expect(result.podcast.description).toEqual("Podcast Description");
    expect(result.episodes).toHaveLength(2);
    expect(result.episodes[0].title).toEqual("Episode 1");
    expect(result.episodes[0].description).toEqual("Episode 1 Description");
    expect(result.episodes[0].enclosure.url).toEqual("http://example.com/episode1.mp3");
    expect(result.episodes[0].itunesDuration).toEqual(600);
    expect(result.episodes[1].title).toEqual("Episode 2");
    expect(result.episodes[1].description).toEqual("Episode 2 Description");
    expect(result.episodes[1].enclosure.url).toEqual("http://example.com/episode2.mp3");
    expect(result.episodes[1].itunesDuration).toEqual(1200);
  });

  it("should handle missing elements in the XML data", () => {
    const xmlText = `
      <rss>
        <channel>
          <title>Podcast Title</title>
          <item>
            <title>Episode Title</title>
            <enclosure url="https://example.com/episode.mp3" type="audio/mpeg" />
          </item>
        </channel>
      </rss>
    `;
    const parsedXml = {
      rss: {
        channel: {
          title: "Podcast Title",
          item: [
            {
              title: "Episode Title",
              enclosure: { "@_url": "https://example.com/episode.mp3", "@_type": "audio/mpeg" },
            },
          ],
        },
      },
    };
    (parseXml as jest.Mock).mockReturnValue(parsedXml);

    const result = transformPodcast(xmlText);

    expect(result).toEqual({
      podcast: {
        contentEncoded: "",
        copyright: "",
        description: "",
        feedUrl: "",
        image: {
          link: "",
          title: "",
          url: "",
        },
        itunesAuthor: "",
        itunesCategory: "",
        itunesExplicit: "",
        itunesImage: "",
        itunesOwner: {
          email: "",
          name: "",
        },
        itunesSubtitle: "",
        itunesSummary: "",
        itunesType: "",
        language: "",
        link: "",
        title: "Podcast Title",
      },
      episodes: [
        {
          title: "Episode Title",
          description: "",
          pubDate: "",
          enclosure: {
            url: "https://example.com/episode.mp3",
            type: "audio/mpeg",
          },
          itunesAuthor: "",
          itunesDuration: 0,
          itunesEpisode: "",
          itunesEpisodeType: "",
          itunesExplicit: "",
          itunesSubtitle: "",
          itunesSummary: "",
          itunesTitle: "",
          link: "",
          guid: "",
          author: "",
          contentEncoded: "",
        },
      ],
    });
  });
});
