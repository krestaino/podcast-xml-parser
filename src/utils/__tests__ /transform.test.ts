import { parseXml } from "@rgrove/parse-xml";
import { transformPodcastData } from "../transform";

describe("transformPodcastData", () => {
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
      </channel>
    </rss>`;

  it("should transform valid XML data into a Podcast object", () => {
    const parsedXml = parseXml(validXml);
    const result = transformPodcastData(parsedXml);
    expect(result).toBeDefined();
    expect(result.podcast).toBeInstanceOf(Object);
    expect(result.podcast.title).toEqual("Podcast Title");
  });
  
  it("should throw an error if the channel element is not found", () => {
    const invalidXml = `<?xml version="1.0" encoding="UTF-8"?><rss></rss>`;
    const parsedXml = parseXml(invalidXml);
    expect(() => transformPodcastData(parsedXml)).toThrow("Channel element not found");
  });

  it("should throw an error if the image element is not found", () => {
    const xmlWithoutImage = `<?xml version="1.0" encoding="UTF-8"?>
      <rss>
        <channel>
          <title>Podcast Title</title>
        </channel>
      </rss>`;

    const parsedXml = parseXml(xmlWithoutImage);
    expect(() => transformPodcastData(parsedXml)).toThrow("Image element not found");
  });

  it("should throw an error if the iTunes owner element is not found", () => {
    const xmlWithoutItunesOwner = `<?xml version="1.0" encoding="UTF-8"?>
      <rss>
        <channel>
          <title>Podcast Title</title>
          <image>
            <url>https://example.com/image.jpg</url>
            <title>Podcast Title</title>
            <link>https://example.com/podcast</link>
          </image>
        </channel>
      </rss>`;

    const parsedXml = parseXml(xmlWithoutItunesOwner);
    expect(() => transformPodcastData(parsedXml)).toThrow("iTunes owner element not found");
  });
});
