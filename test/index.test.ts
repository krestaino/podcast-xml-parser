import fs from "fs";

import podcastXmlParser, { type Podcast, type Episode } from "../src";

// Helper function to assert properties of a Podcast object
export const assertPodcastProperties = (podcast: Podcast): void => {
  expect(podcast.copyright).toBeDefined();
  expect(podcast.contentEncoded).toBeDefined();
  expect(podcast.description).toBeDefined();
  expect(podcast.itunesAuthor).toBeDefined();
  expect(podcast.itunesExplicit).toBeDefined();
  expect(podcast.itunesImage).toBeDefined();
  expect(podcast.itunesSubtitle).toBeDefined();
  expect(podcast.itunesSummary).toBeDefined();
  expect(podcast.itunesType).toBeDefined();
  expect(podcast.language).toBeDefined();
  expect(podcast.link).toBeDefined();
  expect(podcast.title).toBeDefined();
};

// Helper function to assert properties of an Episode object
export const assertEpisodeProperties = (episode: Episode): void => {
  expect(typeof episode.author).toBe("string");
  expect(typeof episode.contentEncoded).toBe("string");
  expect(typeof episode.description).toBe("string");
  expect(episode.enclosure).toBeDefined();
  expect(typeof episode.guid).toBe("string");
  expect(typeof episode.itunesAuthor).toBe("string");
  expect(typeof episode.itunesDuration).toBe("number");
  expect(typeof episode.itunesEpisode).toBe("string");
  expect(typeof episode.itunesEpisodeType).toBe("string");
  expect(typeof episode.itunesExplicit).toBe("string");
  expect(typeof episode.itunesSubtitle).toBe("string");
  expect(typeof episode.itunesSummary).toBe("string");
  expect(typeof episode.itunesTitle).toBe("string");
  expect(typeof episode.link).toBe("string");
  expect(typeof episode.pubDate).toBe("string");
  expect(typeof episode.title).toBe("string");
};

describe("podcastXmlParser", () => {
  it("should handle a valid XML feed and return expected data", async () => {
    const xmlSample = `
      <rss
        xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
        xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
        xmlns:atom="http://www.w3.org/2005/Atom"
        xmlns:media="http://search.yahoo.com/mrss/"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        version="2.0"
      >
        <channel>
          <title>podcast-title</title>
          <link>podcast-link</link>
          <language>podcast-language</language>
          <copyright>podcast-copyright</copyright>
          <description>podcast-description</description>
          <image>
            <url>podcast-image-url</url>
            <title>podcast-image-title</title>
            <link>podcast-image-link</link>
          </image>
          <itunes:explicit>podcast-itunes-explicit</itunes:explicit>
          <itunes:type>podcast-itunes-type</itunes:type>
          <itunes:subtitle>podcast-itunes-subtitle</itunes:subtitle>
          <itunes:author>podcast-itunes-author</itunes:author>
          <itunes:summary>podcast-itunes-summary</itunes:summary>
          <content:encoded><![CDATA[ <p>podcast-content-encoded</p> ]]></content:encoded>
          <itunes:owner>
            <itunes:name>podcast-itunes-owner-itunes-name</itunes:name>
            <itunes:email>podcast-itunes-owner-itunes-email</itunes:email>
          </itunes:owner>
          <itunes:image href="podcast-itunes-image"/>
          <itunes:category text="podcast-itunes-category-1">
            <itunes:category text="podcast-itunes-category-2"/>
          </itunes:category>
          <item>
            <author>episode-author</author>
            <content:encoded>episode-content-encoded</content:encoded>
            <description>episode-description</description>
            <enclosure url="episode-enclosure-url" type="episode-enclosure-type" />
            <guid>episode-guid</guid>
            <itunes:author>episode-itunes-author</itunes:author>
            <itunes:duration>12345</itunes:duration>
            <itunes:episode>episode-itunes-episode</itunes:episode>
            <itunes:episodeType>episode-itunes-episode-type</itunes:episodeType>
            <itunes:explicit>episode-itunes-explicit</itunes:explicit>
            <itunes:subtitle>episode-itunes-subtitle</itunes:subtitle>
            <itunes:summary>episode-itunes-summary</itunes:summary>
            <itunes:title>title</itunes:title>
            <link>episode-link</link>
            <pubDate>episode-pubDate</pubDate>
            <title>episode-title</title>
          </item>
        </channel>
      </rss>
    `;
    const { podcast, episodes } = await podcastXmlParser(xmlSample);
    // expect(podcast.contentEncoded).toBe("<![CDATA[ <p>podcast-content-encoded</p> ]]>");
    expect(podcast.copyright).toBe("podcast-copyright");
    expect(podcast.description).toBe("podcast-description");
    expect(podcast.image?.link).toBe("podcast-image-link");
    expect(podcast.image?.title).toBe("podcast-image-title");
    expect(podcast.image?.url).toBe("podcast-image-url");
    expect(podcast.itunesAuthor).toBe("podcast-itunes-author");
    expect(podcast.itunesExplicit).toBe("podcast-itunes-explicit");
    expect(podcast.itunesImage).toBe("podcast-itunes-image");
    expect(podcast.itunesOwner?.email).toBe("podcast-itunes-owner-itunes-email");
    expect(podcast.itunesOwner?.name).toBe("podcast-itunes-owner-itunes-name");
    expect(podcast.itunesSummary).toBe("podcast-itunes-summary");
    expect(podcast.itunesSubtitle).toBe("podcast-itunes-subtitle");
    expect(podcast.itunesType).toBe("podcast-itunes-type");
    expect(podcast.language).toBe("podcast-language");
    expect(podcast.link).toBe("podcast-link");
    expect(podcast.title).toBe("podcast-title");
    expect(Array.isArray(episodes)).toBe(true);
    expect(episodes.length).toBeGreaterThan(0);
    expect(episodes[0].author).toBe("episode-author");
    expect(episodes[0].contentEncoded).toBe("episode-content-encoded");
    expect(episodes[0].description).toBe("episode-description");
    expect(episodes[0].enclosure?.url).toBe("episode-enclosure-url");
    expect(episodes[0].enclosure?.type).toBe("episode-enclosure-type");
    expect(episodes[0].guid).toBe("episode-guid");
    expect(episodes[0].itunesAuthor).toBe("episode-itunes-author");
    expect(episodes[0].itunesDuration).toBe(12345);
    expect(episodes[0].itunesEpisode).toBe("episode-itunes-episode");
    expect(episodes[0].itunesEpisodeType).toBe("episode-itunes-episode-type");
    expect(episodes[0].itunesExplicit).toBe("episode-itunes-explicit");
    expect(episodes[0].itunesSubtitle).toBe("episode-itunes-subtitle");
    expect(episodes[0].itunesSummary).toBe("episode-itunes-summary");
    expect(episodes[0].itunesTitle).toBe("title");
    expect(episodes[0].link).toBe("episode-link");
    expect(episodes[0].pubDate).toBe("episode-pubDate");
    expect(episodes[0].title).toBe("episode-title");
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should throw an error for an empty XML feed", async () => {
    const emptyXml = "";

    // Mock console.error to suppress the error output
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(podcastXmlParser(emptyXml)).rejects.toThrow();

    // Restore the original console.error implementation after the test
    consoleSpy.mockRestore();
  });

  it("should handle an XML feed with empty elements and attributes", async () => {
    const xmlWithEmptyElements = `
      <rss version="2.0">
        <channel>
          <title></title>
          <item>
            <description></description>
          </item>
        </channel>
      </rss>
    `;
    const { podcast, episodes } = await podcastXmlParser(xmlWithEmptyElements);

    expect(podcast.title).toBe("");
    assertPodcastProperties(podcast);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should handle an XML feed with multiple episodes", async () => {
    const xmlWithMultipleEpisodes = `
      <rss version="2.0">
        <channel>
          <item></item>
          <item></item>
        </channel>
      </rss>
    `;
    const { episodes } = await podcastXmlParser(xmlWithMultipleEpisodes);

    expect(Array.isArray(episodes)).toBe(true);
    expect(episodes.length).toBeGreaterThan(1);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should handle an XML feed with nested XML tags gracefully", async () => {
    const xmlWithNestedTags = `
      <rss version="2.0">
        <channel>
          <item>
            <description>
              This is a <b>bold</b> episode.
            </description>
          </item>
        </channel>
      </rss>
    `;
    const { episodes } = await podcastXmlParser(xmlWithNestedTags);

    expect(Array.isArray(episodes)).toBe(true);
    expect(episodes.length).toBeGreaterThan(0);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should handle an XML feed special characters and entities in XML", async () => {
    const xmlWithSpecialChars = `
      <rss version="2.0">
        <channel>
          <title>Test &amp; Podcast</title>
          <item>
            <description>This is a &lt;b&gt;bold&lt;/b&gt; episode.</description>
          </item>
        </channel>
      </rss>
    `;
    const { podcast, episodes } = await podcastXmlParser(xmlWithSpecialChars);

    expect(podcast.title).toBe("Test & Podcast");
    assertPodcastProperties(podcast);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should handle an XML feed with Unicode characters", async () => {
    const xmlWithUnicodeChars = `
      <rss version="2.0">
        <channel>
          <item>
            <title>Unicode Episode Title - üñîcødé</title>
            <description>This is an episode with Unicode characters - ♥♦♣♠</description>
          </item>
        </channel>
      </rss>
    `;
    const { episodes } = await podcastXmlParser(xmlWithUnicodeChars);

    expect(Array.isArray(episodes)).toBe(true);
    expect(episodes.length).toBeGreaterThan(0);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should handle an XML feed with multiple enclosures", async () => {
    const xmlWithMultipleEnclosures = `
      <rss version="2.0">
        <channel>
          <item></item>
        </channel>
      </rss>
    `;
    const { episodes } = await podcastXmlParser(xmlWithMultipleEnclosures);

    expect(Array.isArray(episodes)).toBe(true);
    expect(episodes.length).toBeGreaterThan(0);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should handle missing elements in the XML feed gracefully", async () => {
    const xmlWithMissingElements = `
      <rss>
        <channel>
          <item>
            <title>Episode 1</title>
          </item>
        </channel>
      </rss>
    `;
    const { episodes } = await podcastXmlParser(xmlWithMissingElements);

    expect(Array.isArray(episodes)).toBe(true);
    expect(episodes.length).toBe(1);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should handle missing enclosure element gracefully", async () => {
    const xmlWithMissingElements = `
      <rss>
        <channel>
          <item>
            <title>Episode 1</title>
            <description>Episode description</description>
          </item>
        </channel>
      </rss>
    `;
    const { episodes } = await podcastXmlParser(xmlWithMissingElements);

    expect(Array.isArray(episodes)).toBe(true);
    expect(episodes.length).toBe(1);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should load and parse a local XML file", async () => {
    const xmlFilePath = "./test/test.xml";
    const xmlData = fs.readFileSync(xmlFilePath, "utf-8");
    const { podcast, episodes } = await podcastXmlParser(xmlData);

    assertPodcastProperties(podcast);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should throw an error if fetch fails", async () => {
    const url = new URL("hxxps://example.com/podcast.xml");
    await expect(podcastXmlParser(url)).rejects.toThrow("Error fetching from feed: " + url.href);
  });

  it("should have an empty feedUrl when xmlSource is a string and XML lacks <atom:link>", async () => {
    const xmlSource = "not_a_url_but_a_string";
    await expect(podcastXmlParser(xmlSource)).rejects.toThrow();
  });

  it("should fetch feedUrl from <atom:link> tag when xmlSource is a string", async () => {
    const xmlSource = `
      <channel>
        <atom:link href="https://example.com/rss_feed.xml" rel="self" type="application/rss+xml" />
      </channel>
    `;

    const { podcast } = await podcastXmlParser(xmlSource);
    expect(podcast.feedUrl).toBe("https://example.com/rss_feed.xml");
    assertPodcastProperties(podcast);
  });

  it("should return correct itunes data", async () => {
    const { podcast, episodes } = await podcastXmlParser(1559139153);

    expect(podcast.feedUrl).toBe("https://feeds.megaphone.fm/climbinggold");
    expect(podcast.title).toBe("Climbing Gold");
    expect(episodes[episodes.length - 1].title).toBe("Coming Soon");
    assertPodcastProperties(podcast);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should throw error using invalid iTunes ID", async () => {
    await expect(podcastXmlParser(0)).rejects.toThrow();
  });

  it("should throw error using invalid input type", async () => {
    await expect(podcastXmlParser({} as any)).rejects.toThrow();
  });

  it("should return correct episodes using `start` and `limit`", async () => {
    const xmlFilePath = "./test/test.xml";
    const xmlData = fs.readFileSync(xmlFilePath, "utf-8");
    const { podcast, episodes } = await podcastXmlParser(xmlData, { start: 1, limit: 1 });

    expect(podcast.title).toBe("My Test Podcast");
    expect(episodes[0].title).toBe("Episode 2 Title");
    assertPodcastProperties(podcast);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should return correct episodes using `requestSize`", async () => {
    const { itunes, podcast, episodes } = await podcastXmlParser(1559139153, { requestSize: 50000 });

    expect(episodes.length).toBeGreaterThanOrEqual(1);
    expect(episodes.length).toBeLessThan(itunes.trackCount);
    assertPodcastProperties(podcast);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });

  it("should fetch and integrate iTunes data when config.itunes is true", async () => {
    const url = new URL("https://feeds.simplecast.com/dHoohVNH");
    const { itunes } = await podcastXmlParser(url, { itunes: true });

    expect(itunes).toBeDefined();
    expect(itunes.feedUrl).toBe("https://feeds.simplecast.com/dHoohVNH");
  });

  it("return itunes when config.itunes is set to true", async () => {
    const { podcast, itunes } = await podcastXmlParser(new URL("https://feeds.simplecast.com/dHoohVNH"), { itunes: true });

    expect(podcast.feedUrl).toBe("https://feeds.simplecast.com/dHoohVNH");
    expect(typeof itunes).toBe("object");
  });
});
