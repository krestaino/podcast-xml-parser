import { parseXml } from "@rgrove/parse-xml";

import { transformPodcast } from "..";

describe("transformPodcast", () => {
  const validXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss>
      <channel>
        <title>Podcast Title</title>
        <link>https://example.com/podcast</link>
        <description>Podcast description.</description>
        <language>en</language>
        <itunes:author>Author Name</itunes:author>
        <itunes:category text="Category"/>
        <itunes:explicit>no</itunes:explicit>
        <itunes:image href="https://example.com/image.jpg"/>
        <itunes:owner>
          <itunes:name>Owner Name</itunes:name>
          <itunes:email>owner@example.com</itunes:email>
        </itunes:owner>
        <itunes:subtitle>Podcast subtitle.</itunes:subtitle>
        <itunes:summary>Podcast summary.</itunes:summary>
        <itunes:type>episodic</itunes:type>
        <image>
          <url>https://example.com/image.jpg</url>
          <title>Podcast Title</title>
          <link>https://example.com/podcast</link>
        </image>
        <item>
          <title>Episode Title</title>
          <description>Episode description.</description>
          <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
          <itunes:author>Episode Author</itunes:author>
          <itunes:duration>1200</itunes:duration>
          <itunes:explicit>no</itunes:explicit>
          <itunes:title>Episode Title</itunes:title>
          <link>https://example.com/episode</link>
          <guid>https://example.com/episode</guid>
          <author>Episode Author</author>
          <content:encoded>Episode content.</content:encoded>
          <enclosure url="https://example.com/audio.mp3" type="audio/mpeg"/>
        </item>
        <item>
          <title>Episode 2 Title</title>
          <description>Episode 2 description.</description>
          <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
          <itunes:author>Episode Author</itunes:author>
          <itunes:duration>invalid</itunes:duration>
          <itunes:explicit>no</itunes:explicit>
          <itunes:title>Episode Title</itunes:title>
          <link>https://example.com/episode</link>
          <guid>https://example.com/episode</guid>
          <author>Episode Author</author>
          <content:encoded>Episode content.</content:encoded>
          <enclosure url="https://example.com/audio.mp3" type="audio/mpeg"/>
        </item>
      </channel>
    </rss>`;

  it("should transform valid XML data into a Podcast object", () => {
    const parsedXml = parseXml(validXml);
    const result = transformPodcast(parsedXml);
    expect(result).toBeDefined();
    expect(result.podcast).toBeInstanceOf(Object);
    expect(result.podcast.title).toEqual("Podcast Title");
  });

  it("should throw an error if the channel element is not found", () => {
    const invalidXml = `<?xml version="1.0" encoding="UTF-8"?><rss></rss>`;
    const parsedXml = parseXml(invalidXml);
    expect(() => transformPodcast(parsedXml)).toThrow("Channel element not found");
  });

  it("should transform episode data correctly", () => {
    const parsedXml = parseXml(validXml);
    const result = transformPodcast(parsedXml);
    expect(result.episodes).toBeInstanceOf(Array);
    expect(result.episodes.length).toBeGreaterThan(0);
    expect(result.episodes[0].title).toEqual("Episode Title");
  });

  it("should set itunesDuration to 0 if itunes:duration is invalid", () => {
    const parsedXml = parseXml(validXml);
    const result = transformPodcast(parsedXml);
    expect(result.episodes[1].itunesDuration).toBe(0);
  });
});
