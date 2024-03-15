import "dotenv/config";

import podcastXmlParser from "../src";
import { assertPodcastProperties, assertEpisodeProperties } from "./index.test";

describe("test feed", () => {
  it(`should parse the XML feed of URL: https://feeds.simplecast.com/dHoohVNH`, async () => {
    const { podcast, episodes } = await podcastXmlParser(new URL("https://feeds.simplecast.com/dHoohVNH"));

    // console.log(podcast.copyright);
    console.log(podcast.description);
    console.log(podcast.contentEncoded);
    console.log(episodes.length && episodes[0].contentEncoded)
    // console.log(podcast);
    
    
    expect(podcast.feedUrl).toBe("https://feeds.simplecast.com/dHoohVNH");
    assertPodcastProperties(podcast);
    episodes.forEach((episode) => {
      assertEpisodeProperties(episode);
    });
  });
});
