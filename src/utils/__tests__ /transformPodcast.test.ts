import { transformPodcast } from "../transformPodcast";
import { parseXml } from "../parseXml";
import { getDuration } from "../sanitize";

jest.mock("../parseXml", () => ({
  parseXml: jest.fn(),
}));

jest.mock("../sanitize", () => ({
  getDuration: jest.fn(),
}));

describe("transformPodcast", () => {
  beforeEach(() => {
    (parseXml as jest.Mock).mockReset();
    (getDuration as jest.Mock).mockReset();
    (getDuration as jest.Mock).mockImplementation((duration) => (duration ? parseInt(duration, 10) : 0));
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
